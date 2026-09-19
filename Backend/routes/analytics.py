from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from extensions import db
from models.user import User
from models.branch import Branch
from models.service import Service
from models.appointment import Appointment
from models.queue import QueueTicket
from models.document import Document, DocumentVerification
from models.payment import Payment
from models.feedback import Feedback, FeedbackAnalysis
from models.branchconnect import BranchPost, BranchSolution, SolutionUsage
from services.tenant import tenant_org_id

analytics_bp = Blueprint('analytics', __name__)


@analytics_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    org = tenant_org_id()
    total_customers = User.query.filter_by(role='CUSTOMER', organization_id=org).count()
    total_branches = Branch.query.filter_by(is_active=True, organization_id=org).count()
    total_services = Service.query.filter_by(is_active=True, organization_id=org).count()
    total_appointments = Appointment.query.filter_by(organization_id=org).count()
    active_appointments = Appointment.query.filter_by(status='SCHEDULED', organization_id=org).count()
    total_queue_tickets = QueueTicket.query.filter_by(organization_id=org).count()
    active_queue = QueueTicket.query.filter(
        QueueTicket.organization_id == org,
        QueueTicket.status.in_(['WAITING', 'CALLED', 'IN_SERVICE'])
    ).count()

    total_documents = Document.query.filter_by(organization_id=org).count()
    verified_docs = Document.query.filter_by(status='VERIFIED', organization_id=org).count()
    action_required = Document.query.filter_by(status='ACTION_REQUIRED', organization_id=org).count()
    doc_verification_rate = (verified_docs / total_documents * 100) if total_documents > 0 else 0

    total_payments = Payment.query.filter_by(organization_id=org).count()
    successful_payments = Payment.query.filter_by(status='SUCCESSFUL', organization_id=org).count()
    total_revenue = db.session.query(func.sum(Payment.amount)).filter_by(
        status='SUCCESSFUL', organization_id=org).scalar() or 0

    total_feedback = Feedback.query.filter_by(organization_id=org).count()
    sentiment_data = db.session.query(
        FeedbackAnalysis.sentiment, func.count(FeedbackAnalysis.id)
    ).join(Feedback).filter(Feedback.organization_id == org).group_by(FeedbackAnalysis.sentiment).all()

    category_data = db.session.query(
        FeedbackAnalysis.category, func.count(FeedbackAnalysis.id)
    ).join(Feedback).filter(Feedback.organization_id == org).group_by(
        FeedbackAnalysis.category).order_by(
        func.count(FeedbackAnalysis.id).desc()
    ).limit(10).all()

    avg_rating = db.session.query(func.avg(Feedback.rating)).filter(
        Feedback.rating.isnot(None), Feedback.organization_id == org
    ).scalar()

    total_posts = BranchPost.query.filter_by(organization_id=org).count()
    total_solutions = BranchSolution.query.filter_by(organization_id=org).count()
    total_adoptions = SolutionUsage.query.filter_by(organization_id=org).count()

    sentiment_dict = {s: c for s, c in sentiment_data if s}
    positive = sentiment_dict.get('Positive', 0)
    negative = sentiment_dict.get('Negative', 0)
    neutral = sentiment_dict.get('Neutral', 0)

    return jsonify({
        'success': True,
        'data': {
            'customer_metrics': {
                'total_customers': total_customers,
                'total_appointments': total_appointments,
                'active_appointments': active_appointments,
                'total_queue_tickets': total_queue_tickets,
                'active_queue': active_queue,
                'total_branches': total_branches,
                'total_services': total_services
            },
            'document_metrics': {
                'total_documents': total_documents,
                'verified': verified_docs,
                'action_required': action_required,
                'verification_rate': round(doc_verification_rate, 1)
            },
            'payment_metrics': {
                'total_payments': total_payments,
                'successful': successful_payments,
                'total_revenue': total_revenue
            },
            'feedback_metrics': {
                'total_feedback': total_feedback,
                'sentiment_breakdown': sentiment_dict,
                'positive': positive,
                'negative': negative,
                'neutral': neutral,
                'avg_rating': round(float(avg_rating), 1) if avg_rating else 0,
                'category_breakdown': {c: n for c, n in category_data if c}
            },
            'branch_intelligence': {
                'total_posts': total_posts,
                'total_solutions': total_solutions,
                'total_adoptions': total_adoptions
            }
        }
    })


@analytics_bp.route('/insights', methods=['GET'])
@jwt_required()
def insights():
    org = tenant_org_id()
    top_complaints = db.session.query(
        FeedbackAnalysis.topic, func.count(FeedbackAnalysis.id)
    ).join(Feedback).filter(
        Feedback.organization_id == org,
        FeedbackAnalysis.sentiment == 'Negative'
    ).group_by(FeedbackAnalysis.topic).order_by(
        func.count(FeedbackAnalysis.id).desc()
    ).limit(5).all()

    common_doc_issues = db.session.query(
        DocumentVerification.overall_status, func.count(DocumentVerification.id)
    ).join(Document).filter(
        Document.organization_id == org
    ).group_by(DocumentVerification.overall_status).all()

    branch_performance = db.session.query(
        Branch.name,
        func.count(Appointment.id)
    ).join(Appointment, Appointment.branch_id == Branch.id).filter(
        Appointment.organization_id == org
    ).group_by(Branch.name).order_by(func.count(Appointment.id).desc()).all()

    insights_list = []
    if top_complaints:
        top = top_complaints[0]
        insights_list.append({
            'type': 'EMERGING_ISSUE',
            'title': 'Emerging Issue',
            'description': f'{top[0] or "Unknown topic"} is currently the most common complaint.',
            'recommended_action': f'Investigate and address "{top[0] or "this issue"}" to improve customer satisfaction.',
            'severity': 'HIGH'
        })

    if common_doc_issues:
        issues_dict = {s: c for s, c in common_doc_issues}
        action_req = issues_dict.get('ACTION_REQUIRED', 0)
        total_ver = sum(issues_dict.values())
        if total_ver > 0 and action_req / total_ver > 0.3:
            insights_list.append({
                'type': 'DOCUMENT_ISSUE',
                'title': 'Document Verification Alert',
                'description': f'{action_req} of {total_ver} documents require action. High rejection rate detected.',
                'recommended_action': 'Improve pre-visit document guidance to reduce incomplete submissions.',
                'severity': 'MEDIUM'
            })

    return jsonify({
        'success': True,
        'data': {
            'top_complaints': [{'topic': t, 'count': c} for t, c in top_complaints if t],
            'branch_performance': [{'branch': b, 'appointments': a} for b, a in branch_performance],
            'insights': insights_list
        }
    })


@analytics_bp.route('/branch/<int:branch_id>', methods=['GET'])
@jwt_required()
def branch_analytics(branch_id):
    org = tenant_org_id()
    branch = Branch.query.filter_by(id=branch_id, organization_id=org).first_or_404()

    appointments = Appointment.query.filter_by(branch_id=branch_id, organization_id=org).count()
    queue_tickets = QueueTicket.query.filter_by(branch_id=branch_id, organization_id=org).count()
    completed = QueueTicket.query.filter_by(branch_id=branch_id, organization_id=org, status='COMPLETED').count()

    avg_wait = db.session.query(func.avg(QueueTicket.estimated_wait_minutes)).filter_by(
        branch_id=branch_id, organization_id=org
    ).filter(QueueTicket.status == 'COMPLETED').scalar()

    branch_feedback = db.session.query(
        FeedbackAnalysis.sentiment, func.count(FeedbackAnalysis.id)
    ).join(Feedback).filter(
        Feedback.branch_id == branch_id,
        Feedback.organization_id == org
    ).group_by(FeedbackAnalysis.sentiment).all()

    solutions = BranchPost.query.filter_by(branch_id=branch_id, organization_id=org).count()

    return jsonify({
        'success': True,
        'data': {
            'branch': branch.to_dict(),
            'metrics': {
                'total_appointments': appointments,
                'total_queue_tickets': queue_tickets,
                'completed_services': completed,
                'avg_wait_minutes': round(float(avg_wait), 1) if avg_wait else 0,
                'feedback_sentiment': {s: c for s, c in branch_feedback if s},
                'shared_solutions': solutions
            }
        }
    })
