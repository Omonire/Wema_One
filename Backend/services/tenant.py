from flask import request
from flask_jwt_extended import get_jwt, get_jwt_identity
from sqlalchemy import or_, cast
from extensions import db
from models.organization import Organization, Subscription, make_slug


def get_jwt_org_id():
    try:
        return get_jwt().get('org_id')
    except Exception:
        return None


def default_org_id():
    org = Organization.query.order_by(Organization.id).first()
    return org.id if org else None


def resolve_public_org_id():
    """Resolve tenant org id for anonymous/public calls: ?org=/org_id= param, else default."""
    org_id = get_jwt_org_id()
    if org_id:
        return int(org_id)

    org_param = request.args.get('org') or request.args.get('org_id')
    if org_param:
        org = Organization.query.filter(
            or_(
                Organization.slug == org_param,
                cast(Organization.id, db.String) == org_param,
            )
        ).first()
        if org:
            return org.id
    return default_org_id()


def tenant_org_id():
    """Org scope for the current request. Authenticated users are always scoped
    to their own organization regardless of query params."""
    from models.user import User
    identity = get_jwt_identity()
    if identity:
        user = db.session.get(User, int(identity))
        if user and user.organization_id:
            return user.organization_id
    return resolve_public_org_id()


def org_for_user(user_id):
    from models.user import User
    user = db.session.get(User, int(user_id))
    if not user or not user.organization_id:
        return None
    return db.session.get(Organization, user.organization_id)


def get_org_by_slug_or_id(value):
    if not value:
        return None
    org = Organization.query.filter(
        or_(
            Organization.slug == value,
            cast(Organization.id, db.String) == value,
        )
    ).first()
    return org


def ensure_default_org():
    """Create a default organization for existing single-tenant deployments
    (or an empty database) so all rows have a tenant. Safe to call any time."""
    org = Organization.query.order_by(Organization.id).first()
    if org:
        return org
    org = Organization(name='Luma', slug='luma', type='BANK', plan='STARTER',
                       welcome_message='Welcome to Luma')
    db.session.add(org)
    db.session.commit()
    sub = Subscription(organization_id=org.id, plan=org.plan, status='ACTIVE')
    db.session.add(sub)
    db.session.commit()
    return org


def backfill_org_rows():
    """Assign every row without an organization to the default org (legacy data)."""
    from models.user import User
    from models.branch import Branch
    from models.service import Service
    from models.appointment import Appointment
    from models.queue import QueueTicket
    from models.document import Document
    from models.payment import Payment
    from models.feedback import Feedback
    from models.branchconnect import BranchPost, BranchSolution, SolutionUsage
    from models.notification import Notification
    from models.audit import AuditLog

    org = ensure_default_org()
    tables = [
        (User, 'users'), (Branch, 'branches'), (Service, 'services'),
        (Appointment, 'appointments'), (QueueTicket, 'queue_tickets'),
        (Document, 'documents'), (Payment, 'payments'), (Feedback, 'feedback'),
        (BranchPost, 'branch_posts'), (BranchSolution, 'branch_solutions'),
        (SolutionUsage, 'solution_usage'), (Notification, 'notifications'),
        (AuditLog, 'audit_logs'),
    ]
    for model, table in tables:
        try:
            model.query.filter_by(organization_id=None).update(
                {'organization_id': org.id}, synchronize_session=False)
        except Exception:
            db.session.rollback()


def slugify(name, excluded=None):
    return make_slug(name, existing=lambda s: bool(db.session.query(Organization.id).filter_by(slug=s).first()) or s in (excluded or []))


def get_org_or_404_for_user(user_id):
    from models.user import User
    user = db.session.get(User, int(user_id))
    if not user:
        return None
    if not user.organization_id:
        user.organization_id = default_org_id()
        db.session.commit()
    org = db.session.get(Organization, user.organization_id)
    return org