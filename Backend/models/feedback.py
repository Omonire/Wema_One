from extensions import db
from datetime import datetime


class Feedback(db.Model):
    __tablename__ = 'feedback'

    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    branch_id = db.Column(db.Integer, db.ForeignKey('branches.id'))
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'))
    type = db.Column(db.String(30), nullable=False, default='FEEDBACK')
    content = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer)
    status = db.Column(db.String(20), nullable=False, default='SUBMITTED')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    branch = db.relationship('Branch', backref='feedbacks', foreign_keys=[branch_id])
    service = db.relationship('Service', backref='feedbacks')
    analysis = db.relationship('FeedbackAnalysis', backref='feedback', uselist=False, cascade='all, delete-orphan')

    def to_dict(self):
        data = {
            'id': self.id,
            'customer_id': self.customer_id,
            'branch_id': self.branch_id,
            'service_id': self.service_id,
            'type': self.type,
            'content': self.content,
            'rating': self.rating,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        if self.analysis:
            data['analysis'] = self.analysis.to_dict()
        return data


class FeedbackAnalysis(db.Model):
    __tablename__ = 'feedback_analysis'

    id = db.Column(db.Integer, primary_key=True)
    feedback_id = db.Column(db.Integer, db.ForeignKey('feedback.id'), nullable=False)
    sentiment = db.Column(db.String(20))
    sentiment_score = db.Column(db.Float)
    topic = db.Column(db.String(200))
    category = db.Column(db.String(80))
    priority = db.Column(db.String(20))
    key_phrases = db.Column(db.JSON)
    ai_notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'feedback_id': self.feedback_id,
            'sentiment': self.sentiment,
            'sentiment_score': self.sentiment_score,
            'topic': self.topic,
            'category': self.category,
            'priority': self.priority,
            'key_phrases': self.key_phrases,
            'ai_notes': self.ai_notes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
