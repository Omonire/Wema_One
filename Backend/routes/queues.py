from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from extensions import db
from models.queue import QueueTicket
import random
import string

queues_bp = Blueprint('queues', __name__)


def generate_ticket_number():
    num = random.randint(1000, 9999)
    return f"WMA-{num}"


@queues_bp.route('/', methods=['POST'])
@jwt_required()
def create_queue_ticket():
    customer_id = int(get_jwt_identity())
    data = request.get_json()

    required = ['branch_id', 'service_id']
    for field in required:
        if field not in data:
            return jsonify({'success': False, 'message': f'{field} is required'}), 400

    branch_id = data['branch_id']
    service_id = data['service_id']

    existing = QueueTicket.query.filter_by(
        customer_id=customer_id, branch_id=branch_id, service_id=service_id
    ).filter(QueueTicket.status.in_(['WAITING', 'CALLED', 'IN_SERVICE'])).first()
    if existing:
        return jsonify({'success': False, 'message': 'You already have an active ticket for this service at this branch', 'data': existing.to_dict()}), 409

    last_ticket = QueueTicket.query.filter_by(branch_id=branch_id).order_by(
        QueueTicket.position.desc()
    ).first()
    position = (last_ticket.position + 1) if last_ticket else 1

    ticket_number = generate_ticket_number()
    while QueueTicket.query.filter_by(ticket_number=ticket_number).first():
        ticket_number = generate_ticket_number()

    avg_service_time = 15
    estimated_wait = (position - 1) * avg_service_time
    estimated_service_time = (datetime.now() + timedelta(minutes=estimated_wait)).strftime('%I:%M %p')

    ticket = QueueTicket(
        ticket_number=ticket_number,
        customer_id=customer_id,
        branch_id=branch_id,
        service_id=service_id,
        appointment_id=data.get('appointment_id'),
        position=position,
        estimated_wait_minutes=estimated_wait,
        estimated_service_time=estimated_service_time,
        status='WAITING'
    )
    db.session.add(ticket)
    db.session.commit()

    return jsonify({
        'success': True,
        'data': ticket.to_dict(),
        'message': 'Queue ticket created'
    }), 201


@queues_bp.route('/<int:ticket_id>', methods=['GET'])
@jwt_required()
def get_queue_ticket(ticket_id):
    ticket = QueueTicket.query.get_or_404(ticket_id)
    ahead = QueueTicket.query.filter_by(branch_id=ticket.branch_id, service_id=ticket.service_id).filter(
        QueueTicket.status == 'WAITING',
        QueueTicket.position < ticket.position
    ).count()
    data = ticket.to_dict()
    data['people_ahead'] = ahead
    return jsonify({'success': True, 'data': data})


@queues_bp.route('/<int:ticket_id>/check-in', methods=['POST'])
@jwt_required()
def check_in(ticket_id):
    ticket = QueueTicket.query.get_or_404(ticket_id)
    ticket.status = 'CHECKED_IN'
    ticket.checked_in_at = datetime.utcnow()
    db.session.commit()
    return jsonify({'success': True, 'data': ticket.to_dict(), 'message': 'Checked in successfully'})


@queues_bp.route('/<int:ticket_id>/call', methods=['POST'])
@jwt_required()
def call_next(ticket_id):
    ticket = QueueTicket.query.get_or_404(ticket_id)
    ticket.status = 'CALLED'
    ticket.called_at = datetime.utcnow()
    db.session.commit()
    return jsonify({'success': True, 'data': ticket.to_dict(), 'message': 'Customer called'})


@queues_bp.route('/<int:ticket_id>/serve', methods=['POST'])
@jwt_required()
def serve(ticket_id):
    ticket = QueueTicket.query.get_or_404(ticket_id)
    ticket.status = 'IN_SERVICE'
    ticket.served_at = datetime.utcnow()
    db.session.commit()
    return jsonify({'success': True, 'data': ticket.to_dict(), 'message': 'Service started'})


@queues_bp.route('/<int:ticket_id>/complete', methods=['POST'])
@jwt_required()
def complete(ticket_id):
    ticket = QueueTicket.query.get_or_404(ticket_id)
    ticket.status = 'COMPLETED'
    ticket.completed_at = datetime.utcnow()
    db.session.commit()
    return jsonify({'success': True, 'data': ticket.to_dict(), 'message': 'Service completed'})


@queues_bp.route('/<int:ticket_id>/cancel', methods=['POST'])
@jwt_required()
def cancel_ticket(ticket_id):
    ticket = QueueTicket.query.get_or_404(ticket_id)
    ticket.status = 'CANCELLED'
    db.session.commit()
    return jsonify({'success': True, 'data': ticket.to_dict(), 'message': 'Ticket cancelled'})


@queues_bp.route('/my-tickets', methods=['GET'])
@jwt_required()
def my_tickets():
    customer_id = int(get_jwt_identity())
    tickets = QueueTicket.query.filter_by(customer_id=customer_id).order_by(
        QueueTicket.created_at.desc()
    ).all()
    return jsonify({'success': True, 'data': [t.to_dict() for t in tickets]})


@queues_bp.route('/active', methods=['GET'])
@jwt_required()
def active_tickets():
    customer_id = int(get_jwt_identity())
    tickets = QueueTicket.query.filter_by(customer_id=customer_id).filter(
        QueueTicket.status.in_(['WAITING', 'CALLED', 'IN_SERVICE', 'CHECKED_IN'])
    ).all()
    return jsonify({'success': True, 'data': [t.to_dict() for t in tickets]})
