from extensions import db
from datetime import datetime


class Appointment(db.Model):
    __tablename__ = 'appointments'

    id = db.Column(db.Integer, primary_key=True)
    organization_id = db.Column(db.Integer, db.ForeignKey('organizations.id'), nullable=True, index=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    branch_id = db.Column(db.Integer, db.ForeignKey('branches.id'), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)
    appointment_date = db.Column(db.Date, nullable=False)
    appointment_time = db.Column(db.Time, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='SCHEDULED')
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    service = db.relationship('Service', backref='appointments')
    queue_ticket = db.relationship('QueueTicket', backref='appointment', uselist=False)

    def to_dict(self):
        return {
            'id': self.id,
            'organization_id': self.organization_id,
            'customer_id': self.customer_id,
            'branch_id': self.branch_id,
            'service_id': self.service_id,
            'appointment_date': self.appointment_date.isoformat() if self.appointment_date else None,
            'appointment_time': self.appointment_time.strftime('%H:%M') if self.appointment_time else None,
            'status': self.status,
            'notes': self.notes,
            'service': self.service.to_dict() if self.service else None,
            'branch': self.branch.to_dict() if self.branch else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
