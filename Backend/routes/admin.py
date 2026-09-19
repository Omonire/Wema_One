import os
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.user import User
from models.service import Service, ServiceRequirement
from services.tenant import tenant_org_id

admin_bp = Blueprint('admin', __name__)


def require_admin(f):
    from functools import wraps
    @wraps(f)
    @jwt_required()
    def decorated(*args, **kwargs):
        user = User.query.get(int(get_jwt_identity()))
        if not user or user.role not in ('ADMIN', 'SUPER_ADMIN'):
            return jsonify({'success': False, 'message': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated


# ─── User Management ─────────────────────────────────────────────────────────

@admin_bp.route('/users', methods=['GET'])
@require_admin
def admin_get_users():
    role = request.args.get('role')
    org_id = tenant_org_id()
    query = User.query.filter_by(organization_id=org_id)
    if role:
        query = query.filter_by(role=role)
    users = query.all()
    return jsonify({'success': True, 'data': [u.to_dict() for u in users]})


@admin_bp.route('/users/<int:user_id>/role', methods=['PUT'])
@require_admin
def admin_update_role(user_id):
    user = User.query.filter_by(id=user_id, organization_id=tenant_org_id()).first_or_404()
    data = request.get_json()
    if 'role' not in data:
        return jsonify({'success': False, 'message': 'Role is required'}), 400
    valid_roles = ['CUSTOMER', 'BRANCH_OFFICER', 'BRANCH_MANAGER', 'ADMIN', 'SUPER_ADMIN']
    if data['role'] not in valid_roles:
        return jsonify({'success': False, 'message': f'Invalid role. Must be one of: {", ".join(valid_roles)}'}), 400
    user.role = data['role']
    db.session.commit()
    return jsonify({'success': True, 'data': user.to_dict(), 'message': 'Role updated'})


@admin_bp.route('/users/<int:user_id>/toggle', methods=['POST'])
@require_admin
def admin_toggle_user(user_id):
    user = User.query.filter_by(id=user_id, organization_id=tenant_org_id()).first_or_404()
    user.is_active = not user.is_active
    db.session.commit()
    status = 'activated' if user.is_active else 'deactivated'
    return jsonify({'success': True, 'data': user.to_dict(), 'message': f'User {status}'})


# ─── Service Management ──────────────────────────────────────────────────────

@admin_bp.route('/services', methods=['GET'])
@require_admin
def admin_get_services():
    """Get all services (including inactive) for admin management."""
    category = request.args.get('category')
    include_inactive = request.args.get('include_inactive', 'false').lower() == 'true'
    org_id = tenant_org_id()

    query = Service.query.filter_by(organization_id=org_id)
    if not include_inactive:
        query = query.filter_by(is_active=True)
    if category:
        query = query.filter_by(category=category)
    
    services = query.order_by(Service.created_at.desc()).all()
    return jsonify({'success': True, 'data': [s.to_dict() for s in services]})


@admin_bp.route('/services', methods=['POST'])
@require_admin
def admin_create_service():
    """Create a new service with custom features."""
    data = request.get_json()
    
    required = ['name', 'category']
    for field in required:
        if field not in data:
            return jsonify({'success': False, 'message': f'{field} is required'}), 400
    
    service = Service(
        organization_id=tenant_org_id(),
        name=data['name'],
        description=data.get('description', ''),
        category=data['category'],
        estimated_time_minutes=data.get('estimated_time_minutes', 30),
        fee=data.get('fee', 0.0),
        is_active=data.get('is_active', True),
        tagline=data.get('tagline', ''),
        icon=data.get('icon', 'CreditCard'),
    )
    
    # Set custom features
    if 'features' in data and isinstance(data['features'], list):
        service.set_features(data['features'])
    
    db.session.add(service)
    db.session.commit()
    
    # Add requirements if provided
    if 'requirements' in data and isinstance(data['requirements'], list):
        for req_data in data['requirements']:
            req = ServiceRequirement(
                service_id=service.id,
                name=req_data['name'],
                description=req_data.get('description', ''),
                is_mandatory=req_data.get('is_mandatory', True),
                document_type=req_data.get('document_type'),
            )
            db.session.add(req)
        db.session.commit()
    
    return jsonify({'success': True, 'data': service.to_dict(), 'message': 'Service created'}), 201


@admin_bp.route('/services/<int:service_id>', methods=['GET'])
@require_admin
def admin_get_service(service_id):
    """Get a single service with all details."""
    service = Service.query.filter_by(id=service_id, organization_id=tenant_org_id()).first_or_404()
    return jsonify({'success': True, 'data': service.to_dict()})


@admin_bp.route('/services/<int:service_id>', methods=['PUT'])
@require_admin
def admin_update_service(service_id):
    """Update a service including custom features."""
    service = Service.query.filter_by(id=service_id, organization_id=tenant_org_id()).first_or_404()
    data = request.get_json()
    
    # Update basic fields
    if 'name' in data:
        service.name = data['name']
    if 'description' in data:
        service.description = data['description']
    if 'category' in data:
        service.category = data['category']
    if 'estimated_time_minutes' in data:
        service.estimated_time_minutes = data['estimated_time_minutes']
    if 'fee' in data:
        service.fee = data['fee']
    if 'is_active' in data:
        service.is_active = data['is_active']
    if 'tagline' in data:
        service.tagline = data['tagline']
    if 'icon' in data:
        service.icon = data['icon']
    
    # Update custom features
    if 'features' in data and isinstance(data['features'], list):
        service.set_features(data['features'])
    
    # Update requirements if provided
    if 'requirements' in data and isinstance(data['requirements'], list):
        # Remove existing requirements
        ServiceRequirement.query.filter_by(service_id=service.id).delete()
        
        # Add new requirements
        for req_data in data['requirements']:
            req = ServiceRequirement(
                service_id=service.id,
                name=req_data['name'],
                description=req_data.get('description', ''),
                is_mandatory=req_data.get('is_mandatory', True),
                document_type=req_data.get('document_type'),
            )
            db.session.add(req)
    
    db.session.commit()
    return jsonify({'success': True, 'data': service.to_dict(), 'message': 'Service updated'})


@admin_bp.route('/services/<int:service_id>', methods=['DELETE'])
@require_admin
def admin_delete_service(service_id):
    """Soft delete a service (mark as inactive)."""
    service = Service.query.filter_by(id=service_id, organization_id=tenant_org_id()).first_or_404()
    service.is_active = False
    db.session.commit()
    return jsonify({'success': True, 'message': 'Service deactivated'})


@admin_bp.route('/services/<int:service_id>/toggle', methods=['POST'])
@require_admin
def admin_toggle_service(service_id):
    """Toggle service active status."""
    service = Service.query.filter_by(id=service_id, organization_id=tenant_org_id()).first_or_404()
    service.is_active = not service.is_active
    db.session.commit()
    status = 'activated' if service.is_active else 'deactivated'
    return jsonify({'success': True, 'data': service.to_dict(), 'message': f'Service {status}'})


@admin_bp.route('/services/bulk', methods=['POST'])
@require_admin
def admin_bulk_create_services():
    """Bulk create services from a JSON array."""
    data = request.get_json()
    org_id = tenant_org_id()
    
    if not isinstance(data, list):
        return jsonify({'success': False, 'message': 'Request body must be an array of services'}), 400
    
    created = []
    errors = []
    
    for idx, item in enumerate(data):
        try:
            if 'name' not in item or 'category' not in item:
                errors.append({'index': idx, 'error': 'name and category are required'})
                continue
            
            service = Service(
                organization_id=org_id,
                name=item['name'],
                description=item.get('description', ''),
                category=item['category'],
                estimated_time_minutes=item.get('estimated_time_minutes', 30),
                fee=item.get('fee', 0.0),
                is_active=item.get('is_active', True),
                tagline=item.get('tagline', ''),
                icon=item.get('icon', 'CreditCard'),
            )
            
            if 'features' in item and isinstance(item['features'], list):
                service.set_features(item['features'])
            
            db.session.add(service)
            db.session.flush()  # Get the ID
            
            if 'requirements' in item and isinstance(item['requirements'], list):
                for req_data in item['requirements']:
                    req = ServiceRequirement(
                        service_id=service.id,
                        name=req_data['name'],
                        description=req_data.get('description', ''),
                        is_mandatory=req_data.get('is_mandatory', True),
                        document_type=req_data.get('document_type'),
                    )
                    db.session.add(req)
            
            created.append(service.to_dict())
        except Exception as e:
            errors.append({'index': idx, 'error': str(e)})
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'data': {
            'created': created,
            'errors': errors,
            'total_created': len(created),
            'total_errors': len(errors),
        },
        'message': f'{len(created)} services created, {len(errors)} errors'
    }), 201


# ─── Health ──────────────────────────────────────────────────────────────────

@admin_bp.route('/health', methods=['GET'])
def health():
    return jsonify({
        'success': True,
        'data': {
            'status': 'healthy',
            'service': 'Luma API',
            'version': '1.0.0'
        }
    })
