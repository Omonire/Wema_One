import os
import platform
import time
from datetime import datetime

from flask import Blueprint, jsonify
from extensions import db
from models.user import User
from models.branch import Branch
from models.service import Service
from models.queue import QueueTicket
from services.tenant import resolve_public_org_id

system_bp = Blueprint('system', __name__)

STARTED_AT = time.time()


@system_bp.route('/health', methods=['GET'])
def health():
    db_ok = True
    try:
        db.session.execute(db.text('SELECT 1'))
    except Exception:
        db_ok = False

    payload = {
        'status': 'ok' if db_ok else 'degraded',
        'database': 'connected' if db_ok else 'error',
        'timestamp': datetime.utcnow().isoformat(),
        'uptime_seconds': int(time.time() - STARTED_AT),
    }
    if not db_ok:
        return jsonify({'success': False, 'data': payload}), 503
    return jsonify({'success': True, 'data': payload})


@system_bp.route('/info', methods=['GET'])
def info():
    env = os.getenv('FLASK_ENV', 'development')
    return jsonify({
        'success': True,
        'data': {
            'name': 'Luma API',
            'version': '1.0.0',
            'environment': env,
            'provider': os.getenv('AI_PROVIDER', 'mock'),
            'ai_enabled': os.getenv('AI_ENABLED', 'false').lower() == 'true',
            'payment_provider': 'ALAT Authenticator',
            'payment_sandbox': os.getenv('ALAT_SANDBOX', 'true').lower() == 'true',
            'python': platform.python_version(),
        }
    })


@system_bp.route('/stats', methods=['GET'])
def stats():
    org_id = resolve_public_org_id()
    counts = {
        'users': User.query.filter_by(organization_id=org_id).count(),
        'branches': Branch.query.filter_by(organization_id=org_id).count(),
        'services': Service.query.filter_by(organization_id=org_id).count(),
        'active_queue_tickets': QueueTicket.query.filter(
            QueueTicket.organization_id == org_id,
            QueueTicket.status.in_(['WAITING', 'SERVING'])).count(),
    }
    return jsonify({'success': True, 'data': counts})