import os
from dotenv import load_dotenv

load_dotenv()


def _normalize_db_url(url):
    """Heroku/Render style postgres:// -> SQLAlchemy postgresql://"""
    if url and url.startswith('postgres://'):
        return url.replace('postgres://', 'postgresql://', 1)
    return url or ''


class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    # DATABASE_URL (PostgreSQL in production) takes priority; SQLite is the local fallback.
    SQLALCHEMY_DATABASE_URI = _normalize_db_url(os.getenv('DATABASE_URL')) or 'sqlite:///luma.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # SEED_DATA: 1 = seed demo data on first boot, 0 = never seed
    SEED_DATA = os.getenv('SEED_DATA', '0') == '1'
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'dev-jwt-secret-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = 86400
    CORS_ORIGINS = [o.strip() for o in os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(',') if o.strip()]
    AI_ENABLED = os.getenv('AI_ENABLED', 'false').lower() == 'true'
    AI_PROVIDER = os.getenv('AI_PROVIDER', 'mock')
    GROQ_API_KEY = os.getenv('GROQ_API_KEY', '')
    GROQ_MODEL = os.getenv('GROQ_MODEL', 'llama-3.3-70b-versatile')
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
    GEMINI_MODEL = os.getenv('GEMINI_MODEL', 'gemini-2.0-flash')

    ALAT_BASE_URL = os.getenv('ALAT_BASE_URL', '')
    ALAT_SANDBOX = os.getenv('ALAT_SANDBOX', 'true').lower() == 'true'
    ALAT_CLIENT_ID = os.getenv('ALAT_CLIENT_ID', '')
    ALAT_CLIENT_SECRET = os.getenv('ALAT_CLIENT_SECRET', '')
    ALAT_CALLBACK_URL = os.getenv('ALAT_CALLBACK_URL', '')
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'uploads')
    MAX_CONTENT_LENGTH = int(os.getenv('MAX_CONTENT_LENGTH', 16 * 1024 * 1024))

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 280,
        'pool_size': int(os.getenv('DB_POOL_SIZE', 5)),
        'max_overflow': int(os.getenv('DB_MAX_OVERFLOW', 10)),
    }

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    SQLALCHEMY_ENGINE_OPTIONS = {}

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
