from extensions import db
from datetime import datetime


class BranchPost(db.Model):
    __tablename__ = 'branch_posts'

    id = db.Column(db.Integer, primary_key=True)
    organization_id = db.Column(db.Integer, db.ForeignKey('organizations.id'), nullable=True, index=True)
    branch_id = db.Column(db.Integer, db.ForeignKey('branches.id'), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    post_type = db.Column(db.String(30), nullable=False, default='SOLUTION')
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(80))
    tags = db.Column(db.JSON)
    is_useful = db.Column(db.Boolean, default=False)
    useful_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    branch = db.relationship('Branch', backref='posts')
    solutions = db.relationship('BranchSolution', backref='post', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'organization_id': self.organization_id,
            'branch_id': self.branch_id,
            'author_id': self.author_id,
            'post_type': self.post_type,
            'title': self.title,
            'content': self.content,
            'category': self.category,
            'tags': self.tags,
            'is_useful': self.is_useful,
            'useful_count': self.useful_count,
            'author': self.author.to_dict() if self.author else None,
            'branch': self.branch.to_dict() if self.branch else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class BranchSolution(db.Model):
    __tablename__ = 'branch_solutions'

    id = db.Column(db.Integer, primary_key=True)
    organization_id = db.Column(db.Integer, db.ForeignKey('organizations.id'), nullable=True, index=True)
    post_id = db.Column(db.Integer, db.ForeignKey('branch_posts.id'), nullable=False)
    problem = db.Column(db.Text, nullable=False)
    solution = db.Column(db.Text, nullable=False)
    result = db.Column(db.Text)
    adopted_by_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    usages = db.relationship('SolutionUsage', backref='solution', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'post_id': self.post_id,
            'problem': self.problem,
            'solution': self.solution,
            'result': self.result,
            'adopted_by_count': self.adopted_by_count,
            'post': self.post.to_dict() if self.post else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class SolutionUsage(db.Model):
    __tablename__ = 'solution_usage'

    id = db.Column(db.Integer, primary_key=True)
    organization_id = db.Column(db.Integer, db.ForeignKey('organizations.id'), nullable=True, index=True)
    solution_id = db.Column(db.Integer, db.ForeignKey('branch_solutions.id'), nullable=False)
    branch_id = db.Column(db.Integer, db.ForeignKey('branches.id'), nullable=False)
    used_by_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    branch = db.relationship('Branch', backref='solution_usages')
    used_by = db.relationship('User', backref='solution_usages')

    def to_dict(self):
        return {
            'id': self.id,
            'solution_id': self.solution_id,
            'branch_id': self.branch_id,
            'used_by_id': self.used_by_id,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
