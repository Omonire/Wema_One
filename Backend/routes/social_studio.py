from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from collections import Counter
from extensions import db
from models.user import User
from models.feedback import Feedback
from services.social_pulse import SocialPulseService
from services.tenant import tenant_org_id

social_studio_bp = Blueprint('social_studio', __name__)


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


@social_studio_bp.route('/overview', methods=['GET'])
@require_admin
def overview():
    branch_id = request.args.get('branch_id', type=int)
    org_id = tenant_org_id()

    query = Feedback.query.filter(Feedback.analysis.has(), Feedback.organization_id == org_id)
    if branch_id:
        query = query.filter_by(branch_id=branch_id)

    feedbacks = query.all()
    total = len(feedbacks)

    if total == 0:
        return jsonify({
            'success': True,
            'data': {
                'total': 0,
                'sentiment': {'Positive': 0, 'Negative': 0, 'Neutral': 0},
                'topics': [],
                'priority': {'High': 0, 'Medium': 0, 'Low': 0},
                'avg_rating': 0,
                'positive_rate': 0,
                'needs_attention': 0,
            }
        })

    sentiment = Counter()
    priority = Counter()
    topics = Counter()
    ratings = []
    needs_attention = 0

    for fb in feedbacks:
        a = fb.analysis
        if not a:
            continue
        sentiment[a.sentiment or 'Neutral'] += 1
        priority[a.priority or 'Medium'] += 1
        topics[a.topic or 'General'] += 1
        if fb.rating:
            ratings.append(fb.rating)
        if a.priority == 'High':
            needs_attention += 1

    avg = round(sum(ratings) / len(ratings), 2) if ratings else 0
    positive = sentiment.get('Positive', 0)

    return jsonify({
        'success': True,
        'data': {
            'total': total,
            'sentiment': dict(sentiment),
            'topics': [{'name': t, 'count': c} for t, c in topics.most_common(10)],
            'priority': dict(priority),
            'avg_rating': avg,
            'positive_rate': round(positive / total * 100, 1) if total else 0,
            'needs_attention': needs_attention,
        }
    })


@social_studio_bp.route('/feedback', methods=['GET'])
@require_admin
def list_feedback():
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)
    sentiment = request.args.get('sentiment')
    priority = request.args.get('priority')
    fb_type = request.args.get('type')
    branch_id = request.args.get('branch_id', type=int)
    org_id = tenant_org_id()

    query = Feedback.query.filter(Feedback.analysis.has(), Feedback.organization_id == org_id)
    if sentiment:
        query = query.filter(Feedback.analysis.has(sentiment=sentiment))
    if priority:
        query = query.filter(Feedback.analysis.has(priority=priority))
    if fb_type:
        query = query.filter_by(type=fb_type)
    if branch_id:
        query = query.filter_by(branch_id=branch_id)

    total = query.count()
    items = query.order_by(Feedback.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()

    return jsonify({
        'success': True,
        'data': [fb.to_dict() for fb in items],
        'pagination': {'page': page, 'per_page': per_page, 'total': total}
    })


@social_studio_bp.route('/analyze', methods=['POST'])
@require_admin
def analyze_text():
    data = request.get_json() or {}
    text = data.get('content')
    if not text or not text.strip():
        return jsonify({'success': False, 'message': 'content is required'}), 400

    sp = SocialPulseService()
    result = sp.analyze(text, data.get('type', 'FEEDBACK'))
    return jsonify({'success': True, 'data': result})