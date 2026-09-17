from extensions import db
from datetime import datetime
import bcrypt


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    phone = db.Column(db.String(20))
    role = db.Column(db.String(20), nullable=False, default='CUSTOMER')
    branch_id = db.Column(db.Integer, db.ForeignKey('branches.id'))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    branch = db.relationship('Branch', backref='users', lazy=True)
    appointments = db.relationship('Appointment', backref='customer', lazy=True, foreign_keys='Appointment.customer_id')
    queue_tickets = db.relationship('QueueTicket', backref='customer', lazy=True, foreign_keys='QueueTicket.customer_id')
    documents = db.relationship('Document', backref='uploader', lazy=True, foreign_keys='Document.customer_id')
    feedback = db.relationship('Feedback', backref='customer', lazy=True, foreign_keys='Feedback.customer_id')
    posts = db.relationship('BranchPost', backref='author', lazy=True, foreign_keys='BranchPost.author_id')
    notifications = db.relationship('Notification', backref='user', lazy=True, foreign_keys='Notification.user_id')

    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'phone': self.phone,
            'role': self.role,
            'branch_id': self.branch_id,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'full_name': f"{self.first_name} {self.last_name}"
        }
