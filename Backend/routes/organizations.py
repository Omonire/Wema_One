from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from extensions import db
from models.organization import Organization, Subscription
from models.user import User
from services.tenant import slugify, org_for_user
from services.security import validate_email, validate_password, limiter
from services.audit_service import log_audit

organizations_bp = Blueprint('organizations', __name__)

ORG_TYPES = ['BANK', 'HOSPITAL', 'GOVERNMENT', 'TELECOM', 'INSURANCE', 'OTHER']


def require_super_admin(f):
    from functools import wraps
    @wraps(f)
    @jwt_required()
    def decorated(*args, **kwargs):
        user = User.query.get(int(get_jwt_identity()))
        if not user or user.role != 'SUPER_ADMIN':
            return jsonify({'success': False, 'message': 'Platform admin access required'}), 403
        return f(*args, **kwargs)
    return decorated


# ── Public onboarding ────────────────────────────────────────────────────────

@organizations_bp.route('/', methods=['GET'])
def list_organizations():
    orgs = Organization.query.filter_by(is_active=True).order_by(Organization.name).all()
    return jsonify({'success': True, 'data': [o.to_dict(public=True) for o in orgs]})


@organizations_bp.route('/<path:slug_or_id>', methods=['GET'])
def get_organization(slug_or_id):
    from services.tenant import get_org_by_slug_or_id
    org = get_org_by_slug_or_id(slug_or_id)
    if not org or not org.is_active:
        return jsonify({'success': False, 'message': 'Organization not found'}), 404
    return jsonify({'success': True, 'data': org.to_dict(public=False)})


@organizations_bp.route('/', methods=['POST'])
@limiter.limit('5/minute')
def create_organization():
    """Self-serve workspace signup: creates the organization + its first admin."""
    data = request.get_json() or {}

    name = (data.get('name') or '').strip()
    if not name:
        return jsonify({'success': False, 'message': 'Organization name is required'}), 400

    org_type = data.get('type', 'BANK')
    if org_type not in ORG_TYPES:
        org_type = 'OTHER'

    slug = slugify(name)

    admin_email = (data.get('email') or '').strip().lower()
    if not validate_email(admin_email):
        return jsonify({'success': False, 'message': 'Valid admin email is required'}), 400
    if User.query.filter_by(email=admin_email).first():
        return jsonify({'success': False, 'message': 'Email already registered'}), 409

    password = data.get('password') or ''
    pw_errors = validate_password(password)
    if pw_errors:
        return jsonify({'success': False, 'message': f'Password must contain: {", ".join(pw_errors)}'}), 400

    first_name = (data.get('first_name') or 'Organization').strip()
    last_name = (data.get('last_name') or 'Admin').strip()

    org = Organization(
        name=name,
        slug=slug,
        type=org_type,
        plan='FREE',
        is_active=True,
        welcome_message=data.get('welcome_message'),
    )
    db.session.add(org)
    db.session.flush()

    sub = Subscription(
        organization_id=org.id,
        plan='FREE',
        status='TRIALING',
        starts_at=datetime.utcnow(),
        ends_at=datetime.utcnow() + timedelta(days=30),
    )
    db.session.add(sub)

    admin = User(
        email=admin_email,
        organization_id=org.id,
        first_name=first_name,
        last_name=last_name,
        phone=data.get('phone'),
        role='ADMIN',
    )
    admin.set_password(password)
    db.session.add(admin)
    db.session.commit()

    token = create_access_token(identity=str(admin.id), additional_claims={'org_id': org.id})
    log_audit(user_id=admin.id, action='ORG_CREATED', resource_type='organization', resource_id=org.id,
              details={'name': name, 'slug': slug})
    return jsonify({
        'success': True,
        'data': {
            'organization': org.to_dict(public=False),
            'user': admin.to_dict(),
            'token': token,
        },
        'message': 'Workspace created. Welcome to Luma SaaS.'
    }), 201


@organizations_bp.route('/me', methods=['GET'])
@jwt_required()
def my_organization():
    org = org_for_user(int(get_jwt_identity()))
    if not org:
        return jsonify({'success': False, 'message': 'No organization assigned'}), 404
    return jsonify({'success': True, 'data': org.to_dict(public=False)})


# ── Platform admin console (SUPER_ADMIN) ─────────────────────────────────────

@organizations_bp.route('/platform', methods=['GET'])
@require_super_admin
def platform_list():
    orgs = Organization.query.order_by(Organization.created_at.desc()).all()
    return jsonify({'success': True, 'data': [o.to_dict(public=False) for o in orgs]})


@organizations_bp.route('/platform', methods=['POST'])
@require_super_admin
def platform_create():
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    if not name:
        return jsonify({'success': False, 'message': 'Organization name is required'}), 400

    org_type = data.get('type', 'BANK')
    if org_type not in ORG_TYPES:
        org_type = 'OTHER'
    plan = data.get('plan', 'FREE')
    if plan not in ('FREE', 'STARTER', 'PRO', 'ENTERPRISE'):
        plan = 'FREE'

    org = Organization(
        name=name,
        slug=slugify(name),
        type=org_type,
        plan=plan,
        is_active=True,
        welcome_message=data.get('welcome_message'),
    )
    db.session.add(org)
    db.session.flush()
    db.session.add(Subscription(
        organization_id=org.id, plan=plan,
        status=data.get('status', 'ACTIVE'),
        ends_at=datetime.utcnow() + timedelta(days=365),
    ))
    db.session.commit()
    return jsonify({'success': True, 'data': org.to_dict(public=False), 'message': 'Organization created'}), 201


@organizations_bp.route('/platform/<int:org_id>', methods=['PATCH'])
@require_super_admin
def platform_update(org_id):
    org = Organization.query.get_or_404(org_id)
    data = request.get_json() or {}
    if 'name' in data:
        org.name = data['name']
    if 'type' in data and data['type'] in ORG_TYPES:
        org.type = data['type']
    if 'plan' in data and data['plan'] in ('FREE', 'STARTER', 'PRO', 'ENTERPRISE'):
        org.plan = data['plan']
    if 'is_active' in data:
        org.is_active = bool(data['is_active'])
    if 'welcome_message' in data:
        org.welcome_message = data['welcome_message']

    if org.subscription:
        org.subscription.plan = org.plan
        if data.get('subscription_status'):
            org.subscription.status = data['subscription_status']
    db.session.commit()
    return jsonify({'success': True, 'data': org.to_dict(public=False), 'message': 'Organization updated'})


@organizations_bp.route('/platform/<int:org_id>/stats', methods=['GET'])
@require_super_admin
def platform_stats(org_id):
    org = Organization.query.get_or_404(org_id)
    from models.branch import Branch
    from models.service import Service
    from models.user import User
    from models.payment import Payment
    from sqlalchemy import func
    stats = {
        'users': User.query.filter_by(organization_id=org_id).count(),
        'branches': Branch.query.filter_by(organization_id=org_id).count(),
        'services': Service.query.filter_by(organization_id=org_id).count(),
        'payments': Payment.query.filter_by(organization_id=org_id).count(),
        'revenue': db.session.execute(
            db.select(func.coalesce(func.sum(Payment.amount), 0))
            .where(Payment.status == 'SUCCESSFUL', Payment.organization_id == org_id)
        ).scalar(),
    }
    return jsonify({'success': True, 'data': stats})