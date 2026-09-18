import os
import sys
from flask import Flask, jsonify
from flask_cors import CORS
from config import config
from extensions import db, ma, jwt, cors

def create_app(config_name=None):
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')

    app = Flask(__name__)
    app.config.from_object(config[config_name])

    if config_name == 'production':
        missing = []
        if not os.getenv('DATABASE_URL'):
            missing.append('DATABASE_URL (PostgreSQL)')
        if app.config['SECRET_KEY'].startswith('dev-'):
            missing.append('SECRET_KEY')
        if app.config['JWT_SECRET_KEY'].startswith('dev-'):
            missing.append('JWT_SECRET_KEY')
        if missing:
            raise RuntimeError('Production misconfigured. Set: ' + ', '.join(missing))

    db.init_app(app)
    ma.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": app.config.get('CORS_ORIGINS', '*')}})

    from services.security import init_security
    init_security(app)

    from routes import register_routes
    register_routes(app)

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'success': False, 'message': 'Resource not found'}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({'success': False, 'message': 'Bad request'}), 400

    with app.app_context():
        _create_all_safe()
        _ensure_columns(app)

    if app.config.get('SEED_DATA'):
        try:
            from seed import seed_if_empty
            seed_if_empty(app)
        except Exception as e:
            app.logger.warning(f'SEED_DATA enabled but seeding failed: {e}')

    return app


def _create_all_safe():
    """create_all() wrapped in a Postgres advisory lock so multiple gunicorn
    workers can't race on schema creation (fixes pg_type_typname_nsp_index)."""
    engine = db.engine
    if engine.url.get_backend_name() == 'postgresql':
        with engine.begin() as conn:
            conn.execute(db.text('SELECT pg_advisory_lock(727271923)'))
            try:
                db.create_all()
            finally:
                conn.execute(db.text('SELECT pg_advisory_unlock(727271923)'))
    else:
        db.create_all()


def _ensure_columns(app):
    """Lightweight migration for SQLite: add missing columns so existing DBs keep working."""
    if not app.config['SQLALCHEMY_DATABASE_URI'].startswith('sqlite'):
        return
    with app.app_context():
        inspector = db.inspect(db.engine)
        existing = {}

        def cols(table):
            if table not in existing:
                existing[table] = {c['name'] for c in inspector.get_columns(table)}
            return existing[table]

        additions = {
            'payments': [
                ("alat_consent_id", "VARCHAR(120)"),
                ("platform_reference", "VARCHAR(120)"),
                ("narration", "VARCHAR(255)"),
            ],
            'notifications': [
                ("read_at", "DATETIME"),
            ],
        }
        for table, cols_list in additions.items():
            try:
                for col, coltype in cols_list:
                    if col not in cols(table):
                        db.session.execute(db.text(f'ALTER TABLE {table} ADD COLUMN {col} {coltype}'))
                db.session.commit()
            except Exception:
                db.session.rollback()


if __name__ == '__main__':
    app = create_app()
    app.run(debug=app.config.get('DEBUG', False), port=5000)
