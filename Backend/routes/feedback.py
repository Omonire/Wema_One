from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.feedback import Feedback, FeedbackAnalysis
from services.social_pulse import SocialPulseService
from services.tenant import tenant_org_id

feedback_bp = Blueprint('feedback', __name__)


@feedback_bp.route('/', methods=['POST'])
@jwt_required()
def create_feedback():
    customer_id = int(get_jwt_identity())
    data = request.get_json()

    if 'content' not in data:
        return jsonify({'success': False, 'message': 'Content is required'}), 400

    fb = Feedback(
        organization_id=tenant_org_id(),
        customer_id=customer_id,
        branch_id=data.get('branch_id'),
        service_id=data.get('service_id'),
        type=data.get('type', 'FEEDBACK'),
        content=data['content'],
        rating=data.get('rating'),
        status='SUBMITTED'
    )
    db.session.add(fb)
    db.session.commit()

    sp = SocialPulseService()
    analysis_result = sp.analyze(fb.content, fb.type)

    analysis = FeedbackAnalysis(
        feedback_id=fb.id,
        sentiment=analysis_result.get('sentiment'),
        sentiment_score=analysis_result.get('sentiment_score'),
        topic=analysis_result.get('topic'),
        category=analysis_result.get('category'),
        priority=analysis_result.get('priority'),
        key_phrases=analysis_result.get('key_phrases'),
        ai_notes=analysis_result.get('ai_notes')
    )
    db.session.add(analysis)
    fb.status = 'ANALYZED'
    db.session.commit()

    return jsonify({
        'success': True,
        'data': fb.to_dict(),
        'message': 'Feedback submitted and analyzed'
    }), 201


@feedback_bp.route('/', methods=['GET'])
@jwt_required()
def get_feedback():
    branch_id = request.args.get('branch_id', type=int)
    sentiment = request.args.get('sentiment')
    fb_type = request.args.get('type')
    org_id = tenant_org_id()

    query = Feedback.query.filter_by(organization_id=org_id)
    if branch_id:
        query = query.filter_by(branch_id=branch_id)
    if fb_type:
        query = query.filter_by(type=fb_type)
    if sentiment:
        query.join(FeedbackAnalysis).filter(FeedbackAnalysis.sentiment == sentiment)

    feedbacks = query.order_by(Feedback.created_at.desc()).all()
    return jsonify({'success': True, 'data': [f.to_dict() for f in feedbacks]})


@feedback_bp.route('/<int:fb_id>', methods=['GET'])
@jwt_required()
def get_single_feedback(fb_id):
    fb = Feedback.query.filter_by(id=fb_id, organization_id=tenant_org_id()).first_or_404()
    return jsonify({'success': True, 'data': fb.to_dict()})


@feedback_bp.route('/my-feedback', methods=['GET'])
@jwt_required()
def my_feedback():
    customer_id = int(get_jwt_identity())
    feedbacks = Feedback.query.filter_by(customer_id=customer_id).order_by(Feedback.created_at.desc()).all()
    return jsonify({'success': True, 'data': [f.to_dict() for f in feedbacks]})


@feedback_bp.route('/analysis', methods=['GET'])
@jwt_required()
def feedback_analysis():
    from sqlalchemy import func
    branch_id = request.args.get('branch_id', type=int)
    org_id = tenant_org_id()

    base_query = Feedback.query.filter_by(organization_id=org_id)
    if branch_id:
        base_query = base_query.filter_by(branch_id=branch_id)

    total = base_query.count()
    sentiments = db.session.query(
        FeedbackAnalysis.sentiment, func.count(FeedbackAnalysis.id)
    ).join(Feedback).filter(Feedback.organization_id == org_id).group_by(FeedbackAnalysis.sentiment).all()

    categories = db.session.query(
        FeedbackAnalysis.category, func.count(FeedbackAnalysis.id)
    ).join(Feedback).filter(Feedback.organization_id == org_id).group_by(FeedbackAnalysis.category).order_by(func.count(FeedbackAnalysis.id).desc()).all()

    priorities = db.session.query(
        FeedbackAnalysis.priority, func.count(FeedbackAnalysis.id)
    ).join(Feedback).filter(Feedback.organization_id == org_id).group_by(FeedbackAnalysis.priority).all()

    topics = db.session.query(
        FeedbackAnalysis.topic, func.count(FeedbackAnalysis.id)
    ).join(Feedback).filter(Feedback.organization_id == org_id).group_by(FeedbackAnalysis.topic).order_by(func.count(FeedbackAnalysis.id).desc()).limit(10).all()

    return jsonify({
        'success': True,
        'data': {
            'total_feedback': total,
            'sentiment_breakdown': {s: c for s, c in sentiments if s},
            'category_breakdown': {c: n for c, n in categories if c},
            'priority_breakdown': {p: n for p, n in priorities if p},
            'top_topics': [{'topic': t, 'count': n} for t, n in topics if t]
        }
    })
