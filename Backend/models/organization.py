from extensions import db
from datetime import datetime
import re
import uuid


def make_slug(name, existing=None):
    slug = re.sub(r'[^a-zA-Z0-9]+', '-', name.lower()).strip('-') or 'workspace'
    if existing is not None:
        base = slug
        n = 2
        while existing(slug):
            slug = f'{base}-{n}'
            n += 1
    return slug


class Organization(db.Model):
    __tablename__ = 'organizations'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(160), nullable=False)
    slug = db.Column(db.String(80), unique=True, nullable=False, index=True)
    type = db.Column(db.String(40), default='BANK')
    plan = db.Column(db.String(20), default='FREE')
    is_active = db.Column(db.Boolean, default=True)
    is_platform = db.Column(db.Boolean, default=False)
    logo_url = db.Column(db.String(300))
    welcome_message = db.Column(db.String(300))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    subscription = db.relationship('Subscription', backref='organization', uselist=False, lazy=True)

    def to_dict(self, public=True):
        data = {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'type': self.type,
            'logo_url': self.logo_url,
            'welcome_message': self.welcome_message,
        }
        if not public:
            data.update({
                'plan': self.plan,
                'is_active': self.is_active,
                'is_platform': self.is_platform,
                'subscription': self.subscription.to_dict() if self.subscription else None,
                'created_at': self.created_at.isoformat() if self.created_at else None,
            })
        return data


class Subscription(db.Model):
    __tablename__ = 'subscriptions'

    id = db.Column(db.Integer, primary_key=True)
    organization_id = db.Column(db.Integer, db.ForeignKey('organizations.id'), nullable=False, unique=True)
    plan = db.Column(db.String(20), nullable=False, default='FREE')
    status = db.Column(db.String(20), nullable=False, default='TRIALING')
    starts_at = db.Column(db.DateTime, default=datetime.utcnow)
    ends_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'plan': self.plan,
            'status': self.status,
            'starts_at': self.starts_at.isoformat() if self.starts_at else None,
            'ends_at': self.ends_at.isoformat() if self.ends_at else None,
        }