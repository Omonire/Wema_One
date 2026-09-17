from extensions import db
from flask import request
from models.audit import AuditLog


def log_audit(user_id=None, action='', resource_type=None, resource_id=None, details=None):
    """Write an audit trail entry. Safe to call anywhere; never raises."""
    try:
        entry = AuditLog(
            user_id=user_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            details=details or {},
            ip_address=request.headers.get('X-Forwarded-For', request.remote_addr) if request else None,
        )
        db.session.add(entry)
        db.session.commit()
    except Exception:
        db.session.rollback()
    return None