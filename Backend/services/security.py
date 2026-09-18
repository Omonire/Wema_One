import time
import re
from functools import wraps
from flask import request, jsonify, g
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

FAILED_LOGINS = {}
LOCKOUT_DURATION = 900
MAX_FAILED = 5


def _client_ip():
    return request.headers.get('X-Forwarded-For', request.remote_addr or '127.0.0.1').split(',')[0].strip()


def is_locked_out(email):
    record = FAILED_LOGINS.get(email)
    if not record:
        return False
    if record['count'] >= MAX_FAILED:
        elapsed = time.time() - record['last_attempt']
        if elapsed < LOCKOUT_DURATION:
            return True
        del FAILED_LOGINS[email]
    return False


def record_failed_login(email):
    if email in FAILED_LOGINS:
        FAILED_LOGINS[email]['count'] += 1
        FAILED_LOGINS[email]['last_attempt'] = time.time()
    else:
        FAILED_LOGINS[email] = {'count': 1, 'last_attempt': time.time()}


def clear_failed_logins(email):
    FAILED_LOGINS.pop(email, None)


def check_lockout():
    email = None
    data = request.get_json(silent=True)
    if data:
        email = data.get('email', '').lower().strip()
    if email and is_locked_out(email):
        remaining = LOCKOUT_DURATION - (time.time() - FAILED_LOGINS[email]['last_attempt'])
        return jsonify({
            'success': False,
            'message': f'Account locked. Try again in {int(remaining / 60) + 1} minutes.'
        }), 429
    return None


def validate_password(password):
    errors = []
    if len(password) < 8:
        errors.append('at least 8 characters')
    if not re.search(r'[A-Z]', password):
        errors.append('one uppercase letter')
    if not re.search(r'[a-z]', password):
        errors.append('one lowercase letter')
    if not re.search(r'\d', password):
        errors.append('one number')
    if not re.search(r'[!@#$%^&*(),.?\":{}|<>]', password):
        errors.append('one special character')
    return errors


def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def init_security(app):
    limiter.init_app(app)

    @app.after_request
    def set_security_headers(response):
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        response.headers['Permissions-Policy'] = 'camera=(), microphone=(), geolocation=()'
        if app.config.get('ENV') == 'production' or not app.config.get('DEBUG'):
            response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        return response

    @app.before_request
    def security_before_request():
        if request.endpoint in ('auth.login', 'auth.register'):
            block = check_lockout()
            if block:
                return block
