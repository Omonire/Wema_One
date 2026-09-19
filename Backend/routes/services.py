from flask import Blueprint, request, jsonify
from models.service import Service, ServiceRequirement
from services.tenant import resolve_public_org_id

services_bp = Blueprint('services', __name__)


@services_bp.route('/', methods=['GET'])
def get_services():
    category = request.args.get('category')
    org_id = resolve_public_org_id()
    query = Service.query.filter_by(is_active=True, organization_id=org_id)
    if category:
        query = query.filter_by(category=category)
    services = query.all()
    return jsonify({'success': True, 'data': [s.to_dict() for s in services]})


@services_bp.route('/<int:service_id>', methods=['GET'])
def get_service(service_id):
    service = Service.query.filter_by(id=service_id, organization_id=resolve_public_org_id()).first_or_404()
    return jsonify({'success': True, 'data': service.to_dict()})


@services_bp.route('/categories', methods=['GET'])
def get_categories():
    from sqlalchemy import distinct
    org_id = resolve_public_org_id()
    categories = [r[0] for r in Service.query.filter_by(organization_id=org_id)
                  .with_entities(distinct(Service.category)).all()]
    return jsonify({'success': True, 'data': categories})
