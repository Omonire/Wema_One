from extensions import db
from datetime import datetime


class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'))
    branch_id = db.Column(db.Integer, db.ForeignKey('branches.id'))
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id'))
    queue_ticket_id = db.Column(db.Integer, db.ForeignKey('queue_tickets.id'))
    amount = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(10), default='NGN')
    payment_method = db.Column(db.String(50), default='WemaPay')
    transaction_ref = db.Column(db.String(100), unique=True, index=True)
    status = db.Column(db.String(20), nullable=False, default='PENDING')
    paid_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    customer = db.relationship('User', backref='payments', foreign_keys=[customer_id])
    service = db.relationship('Service', backref='payments')
    branch = db.relationship('Branch', backref='payments', foreign_keys=[branch_id])

    def to_dict(self):
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'service_id': self.service_id,
            'branch_id': self.branch_id,
            'appointment_id': self.appointment_id,
            'queue_ticket_id': self.queue_ticket_id,
            'amount': self.amount,
            'currency': self.currency,
            'payment_method': self.payment_method,
            'transaction_ref': self.transaction_ref,
            'status': self.status,
            'paid_at': self.paid_at.isoformat() if self.paid_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
