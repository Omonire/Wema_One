from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.user import User
from models.notification import Notification
from datetime import datetime
from services.tenant import tenant_org_id

notifications_bp = Blueprint('notifications', __name__)


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


@notifications_bp.route('/', methods=['GET'])
@jwt_required()
def list_my_notifications():
    user_id = int(get_jwt_identity())
    unread_only = request.args.get('unread', 'false').lower() == 'true'
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)

    query = Notification.query.filter_by(user_id=user_id)
    if unread_only:
        query = query.filter_by(is_read=False)

    total = query.count()
    items = query.order_by(Notification.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()

    return jsonify({
        'success': True,
        'data': [n.to_dict() for n in items],
        'pagination': {'page': page, 'per_page': per_page, 'total': total, 'unread': Notification.query.filter_by(user_id=user_id, is_read=False).count()}
    })


@notifications_bp.route('/unread-count', methods=['GET'])
@jwt_required()
def unread_count():
    user_id = int(get_jwt_identity())
    count = Notification.query.filter_by(user_id=user_id, is_read=False).count()
    return jsonify({'success': True, 'data': {'unread': count}})


@notifications_bp.route('/<int:notification_id>', methods=['GET'])
@jwt_required()
def get_notification(notification_id):
    user_id = int(get_jwt_identity())
    n = Notification.query.filter_by(id=notification_id, user_id=user_id).first_or_404()
    return jsonify({'success': True, 'data': n.to_dict()})


@notifications_bp.route('/<int:notification_id>/read', methods=['PATCH'])
@jwt_required()
def mark_read(notification_id):
    user_id = int(get_jwt_identity())
    n = Notification.query.filter_by(id=notification_id, user_id=user_id).first_or_404()
    n.is_read = True
    n.read_at = datetime.utcnow()
    db.session.commit()
    return jsonify({'success': True, 'data': n.to_dict()})


@notifications_bp.route('/read-all', methods=['POST'])
@jwt_required()
def mark_all_read():
    user_id = int(get_jwt_identity())
    Notification.query.filter_by(user_id=user_id, is_read=False).update({'is_read': True, 'read_at': datetime.utcnow()})
    db.session.commit()
    return jsonify({'success': True, 'message': 'All notifications marked read'})


@notifications_bp.route('/broadcast', methods=['POST'])
@require_admin
def broadcast():
    data = request.get_json() or {}
    title = data.get('title')
    message = data.get('message')
    if not title or not message:
        return jsonify({'success': False, 'message': 'title and message are required'}), 400

    type_ = data.get('type', 'INFO')
    link = data.get('link')
    role = data.get('role')
    org_id = tenant_org_id()

    query = User.query.filter_by(organization_id=org_id)
    if role:
        query = query.filter_by(role=role)
    users = query.all()

    notifications = [Notification(organization_id=org_id, user_id=u.id, title=title, message=message, type=type_, link=link) for u in users]
    db.session.add_all(notifications)
    db.session.commit()
    return jsonify({'success': True, 'message': f'Broadcast sent to {len(users)} users'}), 201


@notifications_bp.route('/<int:notification_id>', methods=['DELETE'])
@jwt_required()
def delete_notification(notification_id):
    user_id = int(get_jwt_identity())
    n = Notification.query.filter_by(id=notification_id, user_id=user_id).first_or_404()
    db.session.delete(n)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Notification deleted'})