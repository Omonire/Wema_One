from extensions import db
from datetime import datetime


class Branch(db.Model):
    __tablename__ = 'branches'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    address = db.Column(db.String(300), nullable=False)
    city = db.Column(db.String(80), nullable=False)
    state = db.Column(db.String(80))
    phone = db.Column(db.String(20))
    email = db.Column(db.String(120))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    opening_hours = db.Column(db.String(200), default='Mon-Fri 8:00AM - 5:00PM')
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    services = db.relationship('BranchService', backref='branch', lazy=True, cascade='all, delete-orphan')
    appointments = db.relationship('Appointment', backref='branch', lazy=True, foreign_keys='Appointment.branch_id')
    queue_tickets = db.relationship('QueueTicket', backref='branch', lazy=True, foreign_keys='QueueTicket.branch_id')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'phone': self.phone,
            'email': self.email,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'opening_hours': self.opening_hours,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class BranchService(db.Model):
    __tablename__ = 'branch_services'

    id = db.Column(db.Integer, primary_key=True)
    branch_id = db.Column(db.Integer, db.ForeignKey('branches.id'), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)
    is_available = db.Column(db.Boolean, default=True)
    estimated_time_minutes = db.Column(db.Integer, default=30)
    fee = db.Column(db.Float, default=0.0)

    service = db.relationship('Service', backref='branch_services')

    def to_dict(self):
        return {
            'id': self.id,
            'branch_id': self.branch_id,
            'service_id': self.service_id,
            'is_available': self.is_available,
            'estimated_time_minutes': self.estimated_time_minutes,
            'fee': self.fee,
            'service': self.service.to_dict() if self.service else None
        }
