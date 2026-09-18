from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from extensions import db
from models.user import User
from services.audit_service import log_audit
from services.security import (
    limiter, record_failed_login, clear_failed_logins,
    validate_password, validate_email
)

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
@limiter.limit('5/minute')
def register():
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'message': 'No data provided'}), 400

    required = ['email', 'password', 'first_name', 'last_name']
    for field in required:
        if field not in data:
            return jsonify({'success': False, 'message': f'{field} is required'}), 400

    email = data['email'].lower().strip()
    if not validate_email(email):
        return jsonify({'success': False, 'message': 'Invalid email format'}), 400

    password = data['password']
    pw_errors = validate_password(password)
    if pw_errors:
        return jsonify({
            'success': False,
            'message': f'Password must contain: {", ".join(pw_errors)}'
        }), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'success': False, 'message': 'Email already registered'}), 409

    user = User(
        email=email,
        first_name=data['first_name'],
        last_name=data['last_name'],
        phone=data.get('phone'),
        role=data.get('role', 'CUSTOMER'),
        branch_id=data.get('branch_id')
    )
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    log_audit(user_id=user.id, action='REGISTER', resource_type='auth', details={'email': email})
    token = create_access_token(identity=str(user.id))
    return jsonify({
        'success': True,
        'data': {'user': user.to_dict(), 'token': token},
        'message': 'Registration successful'
    }), 201


@auth_bp.route('/login', methods=['POST'])
@limiter.limit('10/minute')
def login():
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'success': False, 'message': 'Email and password required'}), 400

    email = data['email'].lower().strip()
    user = User.query.filter(db.func.lower(User.email) == email).first()

    if not user or not user.check_password(data['password']):
        record_failed_login(email)
        log_audit(
            user_id=user.id if user else None,
            action='LOGIN_FAILED',
            resource_type='auth',
            details={'email': email, 'ip': request.remote_addr}
        )
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

    if not user.is_active:
        return jsonify({'success': False, 'message': 'Account deactivated'}), 403

    clear_failed_logins(email)
    log_audit(user_id=user.id, action='LOGIN', resource_type='auth', details={'email': email})
    token = create_access_token(identity=str(user.id))
    return jsonify({
        'success': True,
        'data': {'user': user.to_dict(), 'token': token},
        'message': 'Login successful'
    })


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    user = User.query.get(int(get_jwt_identity()))
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404
    return jsonify({'success': True, 'data': user.to_dict()})
