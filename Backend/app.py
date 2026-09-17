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

    db.init_app(app)
    ma.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": app.config.get('CORS_ORIGINS', '*')}})

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
        db.create_all()
        _ensure_columns(app)

    return app


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
