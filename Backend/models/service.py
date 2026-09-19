from extensions import db
from datetime import datetime
import json


class Service(db.Model):
    __tablename__ = 'services'

    id = db.Column(db.Integer, primary_key=True)
    organization_id = db.Column(db.Integer, db.ForeignKey('organizations.id'), nullable=True, index=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(80), nullable=False)
    estimated_time_minutes = db.Column(db.Integer, default=30)
    fee = db.Column(db.Float, default=0.0)
    is_active = db.Column(db.Boolean, default=True)
    # JSON string storing custom features/benefits for each service
    # Example: ["Easy Processing", "Instant Mastercard Generation", "Zero Hidden Fees"]
    features = db.Column(db.Text, default='[]')
    # Short tagline for the service card
    tagline = db.Column(db.String(200))
    # Icon name (lucide-react icon) for the service
    icon = db.Column(db.String(50), default='CreditCard')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    requirements = db.relationship('ServiceRequirement', backref='service', lazy=True, cascade='all, delete-orphan')

    def get_features(self):
        """Parse features from JSON string."""
        try:
            return json.loads(self.features) if self.features else []
        except (json.JSONDecodeError, TypeError):
            return []

    def set_features(self, features_list):
        """Set features as JSON string."""
        self.features = json.dumps(features_list) if features_list else '[]'

    def to_dict(self):
        return {
            'id': self.id,
            'organization_id': self.organization_id,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'estimated_time_minutes': self.estimated_time_minutes,
            'fee': self.fee,
            'is_active': self.is_active,
            'features': self.get_features(),
            'tagline': self.tagline,
            'icon': self.icon,
            'requirements': [r.to_dict() for r in self.requirements],
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class ServiceRequirement(db.Model):
    __tablename__ = 'service_requirements'

    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text)
    is_mandatory = db.Column(db.Boolean, default=True)
    document_type = db.Column(db.String(80))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'is_mandatory': self.is_mandatory,
            'document_type': self.document_type
        }
