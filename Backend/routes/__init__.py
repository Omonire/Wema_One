from .auth import auth_bp
from .users import users_bp
from .branches import branches_bp
from .services import services_bp
from .appointments import appointments_bp
from .queues import queues_bp
from .documents import documents_bp
from .payments import payments_bp
from .feedback import feedback_bp
from .branchconnect import branchconnect_bp
from .analytics import analytics_bp
from .admin import admin_bp
from .notifications import notifications_bp
from .audit_logs import audit_logs_bp
from .system import system_bp
from .social_studio import social_studio_bp

def register_routes(app):
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(branches_bp, url_prefix='/api/branches')
    app.register_blueprint(services_bp, url_prefix='/api/services')
    app.register_blueprint(appointments_bp, url_prefix='/api/appointments')
    app.register_blueprint(queues_bp, url_prefix='/api/queues')
    app.register_blueprint(documents_bp, url_prefix='/api/documents')
    app.register_blueprint(payments_bp, url_prefix='/api/payments')
    app.register_blueprint(feedback_bp, url_prefix='/api/feedback')
    app.register_blueprint(branchconnect_bp, url_prefix='/api/branchconnect')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
    app.register_blueprint(audit_logs_bp, url_prefix='/api/audit-logs')
    app.register_blueprint(system_bp, url_prefix='/api/system')
    app.register_blueprint(social_studio_bp, url_prefix='/api/social-studio')
