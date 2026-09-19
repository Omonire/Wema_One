from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from models.audit import AuditLog
from services.tenant import tenant_org_id

audit_logs_bp = Blueprint('audit_logs', __name__)


def require_admin(f):
    from functools import wraps
    @wraps(f)
    @jwt_required()
    def decorated(*args, **kwargs):
        user = User.query.get(int(get_jwt_identity()))
        if not user or user.role not in ('ADMIN', 'SUPER_ADMIN'):
            return jsonify({'success': False, 'message': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated


@audit_logs_bp.route('/', methods=['GET'])
@require_admin
def list_audit_logs():
    action = request.args.get('action')
    user_id = request.args.get('user_id', type=int)
    resource_type = request.args.get('resource_type')
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 50, type=int), 200)

    query = AuditLog.query.filter_by(organization_id=tenant_org_id())
    if action:
        query = query.filter(AuditLog.action.ilike(f'%{action}%'))
    if user_id:
        query = query.filter_by(user_id=user_id)
    if resource_type:
        query = query.filter_by(resource_type=resource_type)

    total = query.count()
    items = query.order_by(AuditLog.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()

    return jsonify({
        'success': True,
        'data': [a.to_dict() for a in items],
        'pagination': {'page': page, 'per_page': per_page, 'total': total}
    })


@audit_logs_bp.route('/<int:log_id>', methods=['GET'])
@require_admin
def get_audit_log(log_id):
    entry = AuditLog.query.filter_by(id=log_id, organization_id=tenant_org_id()).first_or_404()
    return jsonify({'success': True, 'data': entry.to_dict()})