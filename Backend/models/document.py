from extensions import db
from datetime import datetime


class Document(db.Model):
    __tablename__ = 'documents'

    id = db.Column(db.Integer, primary_key=True)
    organization_id = db.Column(db.Integer, db.ForeignKey('organizations.id'), nullable=True, index=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'))
    requirement_name = db.Column(db.String(120))
    original_filename = db.Column(db.String(255), nullable=False)
    stored_filename = db.Column(db.String(255), nullable=False)
    file_size = db.Column(db.Integer)
    mime_type = db.Column(db.String(100))
    status = db.Column(db.String(20), nullable=False, default='UPLOADED')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    verifications = db.relationship('DocumentVerification', backref='document', lazy=True, cascade='all, delete-orphan')
    service = db.relationship('Service', backref='documents')

    def to_dict(self):
        return {
            'id': self.id,
            'organization_id': self.organization_id,
            'customer_id': self.customer_id,
            'service_id': self.service_id,
            'requirement_name': self.requirement_name,
            'original_filename': self.original_filename,
            'file_size': self.file_size,
            'mime_type': self.mime_type,
            'status': self.status,
            'verifications': [v.to_dict() for v in self.verifications],
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class DocumentVerification(db.Model):
    __tablename__ = 'document_verifications'

    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('documents.id'), nullable=False)
    document_type_detected = db.Column(db.String(80))
    ocr_text = db.Column(db.Text)
    fields_found = db.Column(db.JSON)
    fields_missing = db.Column(db.JSON)
    name_match = db.Column(db.Boolean)
    inconsistencies = db.Column(db.JSON)
    overall_status = db.Column(db.String(20), nullable=False, default='PENDING')
    confidence_score = db.Column(db.Float)
    ai_notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'document_id': self.document_id,
            'document_type_detected': self.document_type_detected,
            'ocr_text': self.ocr_text,
            'fields_found': self.fields_found,
            'fields_missing': self.fields_missing,
            'name_match': self.name_match,
            'inconsistencies': self.inconsistencies,
            'overall_status': self.overall_status,
            'confidence_score': self.confidence_score,
            'ai_notes': self.ai_notes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
