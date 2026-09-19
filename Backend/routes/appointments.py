from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, date, time
from extensions import db
from models.appointment import Appointment
from services.tenant import tenant_org_id, resolve_public_org_id

appointments_bp = Blueprint('appointments', __name__)


@appointments_bp.route('/', methods=['POST'])
@jwt_required()
def create_appointment():
    customer_id = int(get_jwt_identity())
    data = request.get_json()

    required = ['branch_id', 'service_id', 'appointment_date', 'appointment_time']
    for field in required:
        if field not in data:
            return jsonify({'success': False, 'message': f'{field} is required'}), 400

    try:
        appt_date = date.fromisoformat(data['appointment_date'])
        appt_time = time.fromisoformat(data['appointment_time'])
    except (ValueError, TypeError):
        return jsonify({'success': False, 'message': 'Invalid date or time format'}), 400

    appointment = Appointment(
        organization_id=tenant_org_id(),
        customer_id=customer_id,
        branch_id=data['branch_id'],
        service_id=data['service_id'],
        appointment_date=appt_date,
        appointment_time=appt_time,
        notes=data.get('notes'),
        status='SCHEDULED'
    )
    db.session.add(appointment)
    db.session.commit()

    return jsonify({
        'success': True,
        'data': appointment.to_dict(),
        'message': 'Appointment booked successfully'
    }), 201


@appointments_bp.route('/', methods=['GET'])
@jwt_required()
def get_appointments():
    customer_id = int(get_jwt_identity())
    status = request.args.get('status')
    query = Appointment.query.filter_by(customer_id=customer_id)
    if status:
        query = query.filter_by(status=status)
    appointments = query.order_by(Appointment.appointment_date.desc()).all()
    return jsonify({'success': True, 'data': [a.to_dict() for a in appointments]})


@appointments_bp.route('/<int:appt_id>', methods=['GET'])
@jwt_required()
def get_appointment(appt_id):
    appointment = Appointment.query.filter_by(id=appt_id, organization_id=tenant_org_id()).first_or_404()
    return jsonify({'success': True, 'data': appointment.to_dict()})


@appointments_bp.route('/<int:appt_id>/cancel', methods=['POST'])
@jwt_required()
def cancel_appointment(appt_id):
    appointment = Appointment.query.filter_by(id=appt_id, organization_id=tenant_org_id()).first_or_404()
    appointment.status = 'CANCELLED'
    db.session.commit()
    return jsonify({'success': True, 'data': appointment.to_dict(), 'message': 'Appointment cancelled'})


@appointments_bp.route('/branch/<int:branch_id>', methods=['GET'])
@jwt_required()
def get_branch_appointments(branch_id):
    status = request.args.get('status')
    org_id = tenant_org_id()
    from models.branch import Branch
    Branch.query.filter_by(id=branch_id, organization_id=org_id).first_or_404()
    query = Appointment.query.filter_by(branch_id=branch_id, organization_id=org_id)
    if status:
        query = query.filter_by(status=status)
    appointments = query.order_by(Appointment.appointment_date).all()
    return jsonify({'success': True, 'data': [a.to_dict() for a in appointments]})


@appointments_bp.route('/slots', methods=['GET'])
def get_available_slots():
    branch_id = request.args.get('branch_id', type=int)
    service_id = request.args.get('service_id', type=int)
    date_str = request.args.get('date')

    if not all([branch_id, service_id, date_str]):
        return jsonify({'success': False, 'message': 'branch_id, service_id, and date required'}), 400

    try:
        target_date = date.fromisoformat(date_str)
    except ValueError:
        return jsonify({'success': False, 'message': 'Invalid date format'}), 400

    booked = Appointment.query.filter_by(
        organization_id=resolve_public_org_id(),
        branch_id=branch_id, service_id=service_id, appointment_date=target_date
    ).filter(Appointment.status.in_(['SCHEDULED', 'CONFIRMED'])).all()

    booked_times = [a.appointment_time.strftime('%H:%M') for a in booked if a.appointment_time]

    all_slots = []
    for hour in range(8, 17):
        for minute in [0, 15, 30, 45]:
            slot = f"{hour:02d}:{minute:02d}"
            all_slots.append({
                'time': slot,
                'available': slot not in booked_times
            })

    return jsonify({'success': True, 'data': all_slots})
