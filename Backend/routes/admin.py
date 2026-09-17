import os
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.user import User

admin_bp = Blueprint('admin', __name__)


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


@admin_bp.route('/users', methods=['GET'])
@require_admin
def admin_get_users():
    role = request.args.get('role')
    query = User.query
    if role:
        query = query.filter_by(role=role)
    users = query.all()
    return jsonify({'success': True, 'data': [u.to_dict() for u in users]})


@admin_bp.route('/users/<int:user_id>/role', methods=['PUT'])
@require_admin
def admin_update_role(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    if 'role' not in data:
        return jsonify({'success': False, 'message': 'Role is required'}), 400
    valid_roles = ['CUSTOMER', 'BRANCH_OFFICER', 'BRANCH_MANAGER', 'ADMIN', 'SUPER_ADMIN']
    if data['role'] not in valid_roles:
        return jsonify({'success': False, 'message': f'Invalid role. Must be one of: {", ".join(valid_roles)}'}), 400
    user.role = data['role']
    db.session.commit()
    return jsonify({'success': True, 'data': user.to_dict(), 'message': 'Role updated'})


@admin_bp.route('/users/<int:user_id>/toggle', methods=['POST'])
@require_admin
def admin_toggle_user(user_id):
    user = User.query.get_or_404(user_id)
    user.is_active = not user.is_active
    db.session.commit()
    status = 'activated' if user.is_active else 'deactivated'
    return jsonify({'success': True, 'data': user.to_dict(), 'message': f'User {status}'})


@admin_bp.route('/health', methods=['GET'])
def health():
    return jsonify({
        'success': True,
        'data': {
            'status': 'healthy',
            'service': 'Luma API',
            'version': '1.0.0'
        }
    })
