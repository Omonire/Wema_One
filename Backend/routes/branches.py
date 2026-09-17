from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.branch import Branch, BranchService
from models.service import Service

branches_bp = Blueprint('branches', __name__)


@branches_bp.route('/', methods=['GET'])
def get_branches():
    branches = Branch.query.filter_by(is_active=True).all()
    return jsonify({'success': True, 'data': [b.to_dict() for b in branches]})


@branches_bp.route('/<int:branch_id>', methods=['GET'])
def get_branch(branch_id):
    branch = Branch.query.get_or_404(branch_id)
    return jsonify({'success': True, 'data': branch.to_dict()})


@branches_bp.route('/<int:branch_id>/services', methods=['GET'])
def get_branch_services(branch_id):
    Branch.query.get_or_404(branch_id)
    bs = BranchService.query.filter_by(branch_id=branch_id, is_available=True).all()
    return jsonify({'success': True, 'data': [s.to_dict() for s in bs]})


@branches_bp.route('/<int:branch_id>/queue', methods=['GET'])
def get_branch_queue(branch_id):
    from models.queue import QueueTicket
    tickets = QueueTicket.query.filter_by(branch_id=branch_id).filter(
        QueueTicket.status.in_(['WAITING', 'CALLED', 'IN_SERVICE'])
    ).order_by(QueueTicket.position).all()

    return jsonify({
        'success': True,
        'data': {
            'branch_id': branch_id,
            'waiting': [t.to_dict() for t in tickets if t.status == 'WAITING'],
            'called': [t.to_dict() for t in tickets if t.status == 'CALLED'],
            'in_service': [t.to_dict() for t in tickets if t.status == 'IN_SERVICE'],
            'total_waiting': len([t for t in tickets if t.status == 'WAITING']),
            'current_number': tickets[0].ticket_number if tickets else None
        }
    })


@branches_bp.route('/', methods=['POST'])
@jwt_required()
def create_branch():
    user_id = int(get_jwt_identity())
    from models.user import User
    user = User.query.get(user_id)
    if not user or user.role not in ('ADMIN', 'SUPER_ADMIN'):
        return jsonify({'success': False, 'message': 'Unauthorized'}), 403

    data = request.get_json()
    branch = Branch(
        name=data['name'],
        address=data['address'],
        city=data['city'],
        state=data.get('state'),
        phone=data.get('phone'),
        email=data.get('email'),
        latitude=data.get('latitude'),
        longitude=data.get('longitude'),
        opening_hours=data.get('opening_hours', 'Mon-Fri 8:00AM - 5:00PM')
    )
    db.session.add(branch)
    db.session.commit()
    return jsonify({'success': True, 'data': branch.to_dict(), 'message': 'Branch created'}), 201
