from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
import uuid
from extensions import db
from models.document import Document, DocumentVerification
from services.document_verification import DocumentVerificationService
from services.tenant import tenant_org_id

documents_bp = Blueprint('documents', __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_TYPES = {
    'application/pdf': 'PDF',
    'image/jpeg': 'JPEG',
    'image/png': 'PNG',
    'image/jpg': 'JPG'
}
MAX_FILE_SIZE = 16 * 1024 * 1024


@documents_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_document():
    customer_id = int(get_jwt_identity())

    if 'file' not in request.files:
        return jsonify({'success': False, 'message': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'success': False, 'message': 'No file selected'}), 400

    mime_type = file.content_type
    if mime_type not in ALLOWED_TYPES:
        return jsonify({'success': False, 'message': f'Invalid file type. Allowed: PDF, JPEG, PNG'}), 400

    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)

    if file_size > MAX_FILE_SIZE:
        return jsonify({'success': False, 'message': 'File too large. Maximum 16MB'}), 400

    ext = os.path.splitext(file.filename)[1].lower()
    stored_name = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_FOLDER, stored_name)
    file.save(file_path)

    doc = Document(
        organization_id=tenant_org_id(),
        customer_id=customer_id,
        service_id=request.form.get('service_id', type=int),
        requirement_name=request.form.get('requirement_name'),
        original_filename=file.filename,
        stored_filename=stored_name,
        file_size=file_size,
        mime_type=mime_type,
        status='UPLOADED'
    )
    db.session.add(doc)
    db.session.commit()

    verification_service = DocumentVerificationService()
    result = verification_service.verify(doc, file_path)

    verification = DocumentVerification(
        document_id=doc.id,
        document_type_detected=result.get('document_type'),
        ocr_text=result.get('ocr_text'),
        fields_found=result.get('fields_found'),
        fields_missing=result.get('fields_missing'),
        name_match=result.get('name_match'),
        inconsistencies=result.get('inconsistencies'),
        overall_status=result.get('status'),
        confidence_score=result.get('confidence_score'),
        ai_notes=result.get('ai_notes')
    )
    db.session.add(verification)

    if result.get('status') == 'VERIFIED':
        doc.status = 'VERIFIED'
    elif result.get('status') == 'ACTION_REQUIRED':
        doc.status = 'ACTION_REQUIRED'
    else:
        doc.status = 'PENDING_REVIEW'

    db.session.commit()

    return jsonify({
        'success': True,
        'data': doc.to_dict(),
        'message': 'Document uploaded and verified'
    }), 201


@documents_bp.route('/', methods=['GET'])
@jwt_required()
def get_documents():
    customer_id = int(get_jwt_identity())
    docs = Document.query.filter_by(customer_id=customer_id).order_by(Document.created_at.desc()).all()
    return jsonify({'success': True, 'data': [d.to_dict() for d in docs]})


@documents_bp.route('/<int:doc_id>', methods=['GET'])
@jwt_required()
def get_document(doc_id):
    doc = Document.query.filter_by(id=doc_id, organization_id=tenant_org_id()).first_or_404()
    return jsonify({'success': True, 'data': doc.to_dict()})


@documents_bp.route('/service/<int:service_id>', methods=['GET'])
@jwt_required()
def get_service_documents(service_id):
    customer_id = int(get_jwt_identity())
    docs = Document.query.filter_by(customer_id=customer_id, service_id=service_id).all()
    return jsonify({'success': True, 'data': [d.to_dict() for d in docs]})


@documents_bp.route('/<int:doc_id>', methods=['DELETE'])
@jwt_required()
def delete_document(doc_id):
    doc = Document.query.filter_by(id=doc_id, organization_id=tenant_org_id()).first_or_404()
    file_path = os.path.join(UPLOAD_FOLDER, doc.stored_filename)
    if os.path.exists(file_path):
        os.remove(file_path)
    db.session.delete(doc)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Document deleted'})
