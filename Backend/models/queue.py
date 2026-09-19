from extensions import db
from datetime import datetime


class QueueTicket(db.Model):
    __tablename__ = 'queue_tickets'

    id = db.Column(db.Integer, primary_key=True)
    organization_id = db.Column(db.Integer, db.ForeignKey('organizations.id'), nullable=True, index=True)
    ticket_number = db.Column(db.String(20), nullable=False, unique=True, index=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    branch_id = db.Column(db.Integer, db.ForeignKey('branches.id'), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id'))
    position = db.Column(db.Integer, nullable=False)
    estimated_wait_minutes = db.Column(db.Integer, default=0)
    estimated_service_time = db.Column(db.String(20))
    status = db.Column(db.String(20), nullable=False, default='WAITING')
    checked_in_at = db.Column(db.DateTime)
    called_at = db.Column(db.DateTime)
    served_at = db.Column(db.DateTime)
    completed_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    service = db.relationship('Service', backref='queue_tickets')

    def to_dict(self):
        return {
            'id': self.id,
            'organization_id': self.organization_id,
            'ticket_number': self.ticket_number,
            'customer_id': self.customer_id,
            'branch_id': self.branch_id,
            'service_id': self.service_id,
            'appointment_id': self.appointment_id,
            'position': self.position,
            'estimated_wait_minutes': self.estimated_wait_minutes,
            'estimated_service_time': self.estimated_service_time,
            'status': self.status,
            'checked_in_at': self.checked_in_at.isoformat() if self.checked_in_at else None,
            'called_at': self.called_at.isoformat() if self.called_at else None,
            'served_at': self.served_at.isoformat() if self.served_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'service': self.service.to_dict() if self.service else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
