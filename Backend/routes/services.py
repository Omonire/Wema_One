from flask import Blueprint, request, jsonify
from models.service import Service, ServiceRequirement

services_bp = Blueprint('services', __name__)


@services_bp.route('/', methods=['GET'])
def get_services():
    category = request.args.get('category')
    query = Service.query.filter_by(is_active=True)
    if category:
        query = query.filter_by(category=category)
    services = query.all()
    return jsonify({'success': True, 'data': [s.to_dict() for s in services]})


@services_bp.route('/<int:service_id>', methods=['GET'])
def get_service(service_id):
    service = Service.query.get_or_404(service_id)
    return jsonify({'success': True, 'data': service.to_dict()})


@services_bp.route('/categories', methods=['GET'])
def get_categories():
    from sqlalchemy import distinct
    categories = [r[0] for r in Service.query.with_entities(distinct(Service.category)).all()]
    return jsonify({'success': True, 'data': categories})
