import os
from app import create_app

# Production entry point for gunicorn: gunicorn --bind 0.0.0.0:8000 wsgi:app
app = create_app(os.getenv('FLASK_ENV', 'production'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 5000)), debug=app.config.get('DEBUG', False))