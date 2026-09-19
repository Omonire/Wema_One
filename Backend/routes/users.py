from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.user import User
from services.tenant import tenant_org_id

users_bp = Blueprint('users', __name__)


@users_bp.route('/', methods=['GET'])
@jwt_required()
def get_users():
    user = User.query.get(int(get_jwt_identity()))
    if user.role not in ('ADMIN', 'SUPER_ADMIN'):
        return jsonify({'success': False, 'message': 'Unauthorized'}), 403

    users = User.query.filter_by(organization_id=user.organization_id).all()
    return jsonify({'success': True, 'data': [u.to_dict() for u in users]})


@users_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    user = User.query.get(int(get_jwt_identity()))
    if user.role not in ('ADMIN', 'SUPER_ADMIN') and user.id != user_id:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 403

    target = User.query.filter_by(id=user_id, organization_id=tenant_org_id()).first_or_404()
    return jsonify({'success': True, 'data': target.to_dict()})


@users_bp.route('/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    current = User.query.get(int(get_jwt_identity()))
    if current.role not in ('ADMIN', 'SUPER_ADMIN') and current.id != user_id:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 403

    user = User.query.filter_by(id=user_id, organization_id=tenant_org_id()).first_or_404()
    data = request.get_json()
    for field in ['first_name', 'last_name', 'phone', 'email', 'branch_id']:
        if field in data:
            setattr(user, field, data[field])
    if 'role' in data and current.role in ('ADMIN', 'SUPER_ADMIN'):
        user.role = data['role']
    if 'is_active' in data and current.role in ('ADMIN', 'SUPER_ADMIN'):
        user.is_active = data['is_active']

    db.session.commit()
    return jsonify({'success': True, 'data': user.to_dict(), 'message': 'User updated'})
