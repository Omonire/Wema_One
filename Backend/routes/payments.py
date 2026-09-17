from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from extensions import db
from models.payment import Payment
from services.payment_service import PaymentService
import uuid

payments_bp = Blueprint('payments', __name__)


@payments_bp.route('/', methods=['POST'])
@jwt_required()
def create_payment():
    customer_id = int(get_jwt_identity())
    data = request.get_json()

    required = ['service_id', 'amount']
    for field in required:
        if field not in data:
            return jsonify({'success': False, 'message': f'{field} is required'}), 400

    transaction_ref = f"WEM-{uuid.uuid4().hex[:12].upper()}"

    payment = Payment(
        customer_id=customer_id,
        service_id=data['service_id'],
        branch_id=data.get('branch_id'),
        appointment_id=data.get('appointment_id'),
        queue_ticket_id=data.get('queue_ticket_id'),
        amount=data['amount'],
        currency=data.get('currency', 'NGN'),
        payment_method=data.get('payment_method', 'WemaPay'),
        transaction_ref=transaction_ref,
        status='PENDING'
    )
    db.session.add(payment)
    db.session.commit()

    payment_service = PaymentService()
    result = payment_service.process_payment(payment)

    if result.get('success'):
        payment.status = 'SUCCESSFUL'
        payment.paid_at = datetime.utcnow()
    else:
        payment.status = 'FAILED'

    db.session.commit()

    return jsonify({
        'success': True,
        'data': payment.to_dict(),
        'message': 'Payment processed'
    }), 201


@payments_bp.route('/', methods=['GET'])
@jwt_required()
def get_payments():
    customer_id = int(get_jwt_identity())
    payments = Payment.query.filter_by(customer_id=customer_id).order_by(Payment.created_at.desc()).all()
    return jsonify({'success': True, 'data': [p.to_dict() for p in payments]})


@payments_bp.route('/<int:payment_id>', methods=['GET'])
@jwt_required()
def get_payment(payment_id):
    payment = Payment.query.get_or_404(payment_id)
    return jsonify({'success': True, 'data': payment.to_dict()})


@payments_bp.route('/ref/<string:ref>', methods=['GET'])
@jwt_required()
def get_payment_by_ref(ref):
    payment = Payment.query.filter_by(transaction_ref=ref).first_or_404()
    return jsonify({'success': True, 'data': payment.to_dict()})
