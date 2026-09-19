from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.branchconnect import BranchPost, BranchSolution, SolutionUsage
from services.tenant import tenant_org_id, resolve_public_org_id

branchconnect_bp = Blueprint('branchconnect', __name__)


@branchconnect_bp.route('/posts', methods=['POST'])
@jwt_required()
def create_post():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    required = ['branch_id', 'title', 'content', 'post_type']
    for field in required:
        if field not in data:
            return jsonify({'success': False, 'message': f'{field} is required'}), 400

    post = BranchPost(
        organization_id=tenant_org_id(),
        branch_id=data['branch_id'],
        author_id=user_id,
        post_type=data['post_type'],
        title=data['title'],
        content=data['content'],
        category=data.get('category'),
        tags=data.get('tags')
    )
    db.session.add(post)
    db.session.commit()

    if data['post_type'] == 'SOLUTION' and data.get('solution'):
        sol_data = data['solution']
        solution = BranchSolution(
            organization_id=post.organization_id,
            post_id=post.id,
            problem=sol_data.get('problem', ''),
            solution=sol_data.get('solution', ''),
            result=sol_data.get('result')
        )
        db.session.add(solution)
        db.session.commit()

    return jsonify({'success': True, 'data': post.to_dict(), 'message': 'Post created'}), 201


@branchconnect_bp.route('/posts', methods=['GET'])
def get_posts():
    post_type = request.args.get('type')
    branch_id = request.args.get('branch_id', type=int)
    search = request.args.get('search')
    org_id = resolve_public_org_id()

    query = BranchPost.query.filter_by(organization_id=org_id)
    if post_type:
        query = query.filter_by(post_type=post_type)
    if branch_id:
        query = query.filter_by(branch_id=branch_id)
    if search:
        query = query.filter(
            db.or_(
                BranchPost.title.ilike(f'%{search}%'),
                BranchPost.content.ilike(f'%{search}%')
            )
        )

    posts = query.order_by(BranchPost.created_at.desc()).all()
    return jsonify({'success': True, 'data': [p.to_dict() for p in posts]})


@branchconnect_bp.route('/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    post = BranchPost.query.filter_by(id=post_id, organization_id=resolve_public_org_id()).first_or_404()
    return jsonify({'success': True, 'data': post.to_dict()})


@branchconnect_bp.route('/posts/<int:post_id>/useful', methods=['POST'])
@jwt_required()
def mark_useful(post_id):
    post = BranchPost.query.filter_by(id=post_id, organization_id=tenant_org_id()).first_or_404()
    post.useful_count += 1
    post.is_useful = True
    db.session.commit()
    return jsonify({'success': True, 'data': post.to_dict(), 'message': 'Marked as useful'})


@branchconnect_bp.route('/solutions', methods=['GET'])
def get_solutions():
    branch_id = request.args.get('branch_id', type=int)
    org_id = resolve_public_org_id()
    query = BranchSolution.query.filter_by(organization_id=org_id)
    if branch_id:
        query = query.join(BranchPost).filter(BranchPost.branch_id == branch_id)
    solutions = query.order_by(BranchSolution.created_at.desc()).all()
    return jsonify({'success': True, 'data': [s.to_dict() for s in solutions]})


@branchconnect_bp.route('/solutions/<int:sol_id>/adopt', methods=['POST'])
@jwt_required()
def adopt_solution(sol_id):
    user_id = int(get_jwt_identity())
    from models.user import User
    user = User.query.get(user_id)
    data = request.get_json() or {}

    solution = BranchSolution.query.filter_by(id=sol_id, organization_id=tenant_org_id()).first_or_404()
    usage = SolutionUsage(
        organization_id=tenant_org_id(),
        solution_id=sol_id,
        branch_id=user.branch_id,
        used_by_id=user_id,
        notes=data.get('notes')
    )
    solution.adopted_by_count += 1
    db.session.add(usage)
    db.session.commit()

    return jsonify({'success': True, 'data': solution.to_dict(), 'message': 'Solution adopted'})


@branchconnect_bp.route('/stats', methods=['GET'])
def get_stats():
    from sqlalchemy import func
    org_id = resolve_public_org_id()
    total_posts = BranchPost.query.filter_by(organization_id=org_id).count()
    total_solutions = BranchSolution.query.filter_by(organization_id=org_id).count()
    total_adoptions = SolutionUsage.query.filter_by(organization_id=org_id).count()
    post_types = db.session.query(
        BranchPost.post_type, func.count(BranchPost.id)
    ).filter(BranchPost.organization_id == org_id).group_by(BranchPost.post_type).all()

    top_solutions = BranchSolution.query.filter_by(organization_id=org_id).order_by(
        BranchSolution.adopted_by_count.desc()
    ).limit(5).all()

    return jsonify({
        'success': True,
        'data': {
            'total_posts': total_posts,
            'total_solutions': total_solutions,
            'total_adoptions': total_adoptions,
            'post_types': {t: c for t, c in post_types},
            'top_solutions': [s.to_dict() for s in top_solutions]
        }
    })
