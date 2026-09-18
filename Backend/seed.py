import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from extensions import db
from models.user import User
from models.branch import Branch, BranchService
from models.service import Service, ServiceRequirement
from models.appointment import Appointment
from models.queue import QueueTicket
from models.document import Document, DocumentVerification
from models.payment import Payment
from models.feedback import Feedback, FeedbackAnalysis
from models.branchconnect import BranchPost, BranchSolution, SolutionUsage
from datetime import date, time, datetime, timedelta
import random


def seed(app, drop=True, only_if_empty=False):
    with app.app_context():
        if drop:
            db.drop_all()
        db.create_all()

        if only_if_empty and User.query.first():
            print("Database already contains data; skipping seed.")
            return False

        print("Seeding users...")
        users = []
        roles_data = [
            ('admin@Luma.com', 'Admin', 'User', 'ADMIN', None),
            ('superadmin@Luma.com', 'Super', 'Admin', 'SUPER_ADMIN', None),
        ]
        for email, first, last, role, bid in roles_data:
            u = User(email=email, first_name=first, last_name=last, role=role, phone='08012345678')
            u.set_password('password123')
            users.append(u)

        branches_data = [
            ('University Road Branch', '12 University Road, Ibadan', 'Ibadan', 'Oyo'),
            ('Airport Road Branch', '5 Airport Road, Ikeja', 'Lagos', 'Lagos'),
            ('Ring Road Branch', '28 Ring Road, Ibadan', 'Ibadan', 'Oyo'),
            ('GRA Branch', '15 GRA Road, Port Harcourt', 'Port Harcourt', 'Rivers'),
            ('Lagos Island Branch', '3 Marina, Lagos Island', 'Lagos', 'Lagos'),
        ]
        branches = []
        for name, addr, city, state in branches_data:
            b = Branch(name=name, address=addr, city=city, state=state,
                       phone=f'01-{random.randint(1000000, 9999999)}',
                       email=f'{name.split()[0].lower()}@luma.com',
                       latitude=random.uniform(6.0, 7.5),
                       longitude=random.uniform(3.0, 5.0))
            db.session.add(b)
            branches.append(b)
        db.session.flush()

        bo_emails = [
            ('officer1@Luma.com', 'Adebayo', 'Okafor', 'BRANCH_OFFICER', 0),
            ('officer2@Luma.com', 'Ngozi', 'Adeyemi', 'BRANCH_OFFICER', 1),
            ('manager1@Luma.com', 'Chidi', 'Eze', 'BRANCH_MANAGER', 0),
            ('manager2@Luma.com', 'Funke', 'Olawale', 'BRANCH_MANAGER', 1),
        ]
        for email, first, last, role, bidx in bo_emails:
            u = User(email=email, first_name=first, last_name=last, role=role,
                     branch_id=branches[bidx].id, phone=f'080{random.randint(10000000, 99999999)}')
            u.set_password('password123')
            users.append(u)

        print("Seeding services...")
        services_data = [
            ('Open Business Account', 'Start your business journey with a Luma business account', 'Accounts', 45, 5000,
             ['Easy Processing', 'Instant Mastercard Generation', 'Zero Hidden Fees', 'Dedicated Relationship Manager'],
             'Business Banking Made Simple',
             'Building2',
             [('CAC Documents', 'Certificate of Incorporation and MEMART', True),
              ('Valid ID', 'Government-issued photo ID', True),
              ('Passport Photograph', 'Recent passport-sized photograph', True),
              ('Proof of Address', 'Utility bill or bank statement', True),
              ('Other Required Documents', 'CAC form CAC1.1, TIN registration', False)]),
            ('Open Personal Account', 'Open a personal savings or current account', 'Accounts', 30, 2000,
             ['Quick Setup', 'Free Debit Card', 'Mobile Banking Access', 'No Minimum Balance'],
             'Your Money, Your Way',
             'Wallet',
             [('Valid ID', 'Government-issued photo ID', True),
              ('Passport Photograph', 'Recent passport-sized photograph', True),
              ('BVN', 'Bank Verification Number', True)]),
            ('Card Services', 'Apply for debit or credit card, card replacement', 'Cards', 20, 1500,
             ['Instant Card Issuance', 'Worldwide Acceptance', 'Contactless Payment', 'Free Card Replacement'],
             'Pay Everywhere, Anytime',
             'CreditCard',
             [('Valid ID', 'Government-issued photo ID', True),
              ('Account Number', 'Existing Luma account number', True)]),
            ('Account Verification', 'Verify your account for enhanced services', 'Verification', 15, 0,
             ['Instant Verification', 'Enhanced Limits', 'Secure Process', 'One-Time Setup'],
             'Unlock Full Access',
             'ShieldCheck',
             [('Valid ID', 'Government-issued photo ID', True),
              ('BVN', 'Bank Verification Number', True)]),
            ('Loan Application', 'Apply for personal or business loans', 'Lending', 60, 0,
             ['Competitive Rates', 'Quick Approval', 'Flexible Repayment', 'No Hidden Charges'],
             'Funds When You Need Them',
             'Landmark',
             [('Valid ID', 'Government-issued photo ID', True),
              ('Proof of Income', 'Salary slip or business financials', True),
              ('CAC Documents', 'Business registration (for business loans)', False),
              ('Bank Statements', 'Last 6 months bank statements', True)]),
            ('BVN Services', 'BVN registration, update, or correction', 'Verification', 25, 500,
             ['Same-Day Registration', 'Instant Update', ' Nationwide Coverage', 'Secure Biometrics'],
             'Your Identity, Verified',
             'Fingerprint',
             [('Valid ID', 'Government-issued photo ID', True),
              ('Passport Photograph', 'Recent passport-sized photograph', True)]),
        ]

        services = []
        for name, desc, cat, est_time, fee, features, tagline, icon, reqs in services_data:
            s = Service(name=name, description=desc, category=cat,
                       estimated_time_minutes=est_time, fee=fee,
                       tagline=tagline, icon=icon)
            s.set_features(features)
            db.session.add(s)
            services.append(s)
        db.session.flush()

        for s in services:
            for req_name, req_desc, mandatory in (s.requirements if hasattr(s, '_temp_reqs') else []):
                pass

        for service_idx, (_, _, _, _, _, _, _, _, reqs) in enumerate(services_data):
            for req_name, req_desc, mandatory in reqs:
                sr = ServiceRequirement(
                    service_id=services[service_idx].id,
                    name=req_name,
                    description=req_desc,
                    is_mandatory=mandatory,
                    document_type=req_name
                )
                db.session.add(sr)

        for branch in branches:
            for service in services:
                bs = BranchService(
                    branch_id=branch.id,
                    service_id=service.id,
                    is_available=True,
                    estimated_time_minutes=service.estimated_time_minutes,
                    fee=service.fee
                )
                db.session.add(bs)

        db.session.flush()

        print("Seeding customer users...")
        customer_data = [
            ('david@test.com', 'David', 'Okonkwo'),
            ('ama@test.com', 'Ama', 'Nkemelu'),
            ('tunde@test.com', 'Tunde', 'Bakare'),
            ('chioma@test.com', 'Chioma', 'Uche'),
            ('olusegun@test.com', 'Olusegun', 'Adeleke'),
            ('fatima@test.com', 'Fatima', 'Abdullahi'),
        ]
        customers = []
        for email, first, last in customer_data:
            u = User(email=email, first_name=first, last_name=last, role='CUSTOMER',
                     phone=f'080{random.randint(10000000, 99999999)}')
            u.set_password('password123')
            customers.append(u)
            users.append(u)

        db.session.add_all(users)
        db.session.flush()

        print("Seeding appointments and queue tickets...")
        today = date.today()
        for i, customer in enumerate(customers):
            branch = branches[i % len(branches)]
            service = services[i % len(services)]

            appt = Appointment(
                customer_id=customer.id,
                branch_id=branch.id,
                service_id=service.id,
                appointment_date=today + timedelta(days=random.randint(0, 7)),
                appointment_time=time(random.randint(8, 16), random.choice([0, 15, 30, 45])),
                status='SCHEDULED'
            )
            db.session.add(appt)
            db.session.flush()

            ticket_num = f"LUM-{random.randint(1000, 9999)}"
            ticket = QueueTicket(
                ticket_number=ticket_num,
                customer_id=customer.id,
                branch_id=branch.id,
                service_id=service.id,
                appointment_id=appt.id,
                position=i + 1,
                estimated_wait_minutes=i * 15,
                estimated_service_time=f"{9 + i}:{random.choice(['00', '15', '30', '45'])} AM",
                status=random.choice(['WAITING', 'COMPLETED', 'COMPLETED', 'CHECKED_IN'])
            )
            db.session.add(ticket)

        print("Seeding documents...")
        doc_templates = [
            ('CAC Certificate.pdf', 'application/pdf', 'VERIFIED'),
            ('Passport Photo.jpg', 'image/jpeg', 'VERIFIED'),
            ('Utility Bill.pdf', 'application/pdf', 'ACTION_REQUIRED'),
            ('ID Card.png', 'image/png', 'VERIFIED'),
        ]
        for i, customer in enumerate(customers):
            for fname, mime, status in doc_templates:
                doc = Document(
                    customer_id=customer.id,
                    service_id=services[i % len(services)].id,
                    requirement_name=fname.split('.')[0],
                    original_filename=f"{customer.first_name}_{fname}",
                    stored_filename=f"{random.randint(10000, 99999)}_{fname}",
                    file_size=random.randint(50000, 5000000),
                    mime_type=mime,
                    status=status
                )
                db.session.add(doc)
                db.session.flush()

                verification = DocumentVerification(
                    document_id=doc.id,
                    document_type_detected=fname.split('.')[0],
                    ocr_text=f"[OCR content from {fname}]",
                    fields_found=['name', 'date', 'address'] if status == 'VERIFIED' else ['name', 'date'],
                    fields_missing=[] if status == 'VERIFIED' else ['address'],
                    name_match=random.choice([True, True, False]),
                    inconsistencies=[] if status == 'VERIFIED' else ['Missing address'],
                    overall_status=status,
                    confidence_score=random.uniform(0.7, 0.99) if status == 'VERIFIED' else random.uniform(0.3, 0.6),
                    ai_notes=f'Document {fname} verified as {status}'
                )
                db.session.add(verification)

        print("Seeding payments...")
        for i, customer in enumerate(customers):
            payment = Payment(
                customer_id=customer.id,
                service_id=services[i % len(services)].id,
                branch_id=branches[i % len(branches)].id,
                amount=services[i % len(services)].fee,
                payment_method='ALAT Authenticator',
                transaction_ref=f"LUM-{random.randint(100000, 999999)}",
                status='SUCCESSFUL',
                paid_at=datetime.now() - timedelta(days=random.randint(0, 30))
            )
            db.session.add(payment)

        print("Seeding feedback...")
        feedback_data = [
            ('I didnt understand which documents I needed for the business account.', 'COMPLAINT', 'Negative'),
            ('The queue moved faster than expected. Great service!', 'FEEDBACK', 'Positive'),
            ('How long does BVN registration take?', 'QUESTION', 'Neutral'),
            ('Staff was very helpful and explained everything clearly.', 'FEEDBACK', 'Positive'),
            ('I waited for over an hour without being called.', 'COMPLAINT', 'Negative'),
            ('The online appointment booking saved me so much time.', 'FEEDBACK', 'Positive'),
            ('Payment processing was confusing and slow.', 'COMPLAINT', 'Negative'),
            ('Can I apply for a loan online or do I need to visit?', 'QUESTION', 'Neutral'),
            ('Excellent branch experience at University Road.', 'FEEDBACK', 'Positive'),
            ('My documents were rejected without clear explanation.', 'COMPLAINT', 'Negative'),
            ('The digital queue ticket system is very convenient.', 'FEEDBACK', 'Positive'),
            ('I was charged fees that were not disclosed upfront.', 'COMPLAINT', 'Negative'),
        ]

        for i, (content, fb_type, sentiment) in enumerate(feedback_data):
            fb = Feedback(
                customer_id=customers[i % len(customers)].id,
                branch_id=branches[i % len(branches)].id,
                service_id=services[i % len(services)].id,
                type=fb_type,
                content=content,
                rating=random.randint(1, 5),
                status='ANALYZED'
            )
            db.session.add(fb)
            db.session.flush()

            analysis = FeedbackAnalysis(
                feedback_id=fb.id,
                sentiment=sentiment,
                sentiment_score=random.uniform(0.1, 0.3) if sentiment == 'Negative' else random.uniform(0.7, 0.9) if sentiment == 'Positive' else random.uniform(0.4, 0.6),
                topic='Business Account Documentation' if 'document' in content.lower() else 'Queue Management' if 'wait' in content.lower() or 'queue' in content.lower() else 'General Banking',
                category='Onboarding' if 'document' in content.lower() or 'understand' in content.lower() else 'Branch Operations' if 'wait' in content.lower() or 'queue' in content.lower() else 'Customer Service',
                priority='High' if sentiment == 'Negative' else 'Low' if sentiment == 'Positive' else 'Medium',
                key_phrases=content.lower().split()[:5],
                ai_notes=f'Auto-analyzed: {sentiment} sentiment detected'
            )
            db.session.add(analysis)

        print("Seeding BranchConnect...")
        posts_data = [
            {
                'branch_id': branches[0].id,
                'author_id': users[3].id,
                'post_type': 'SOLUTION',
                'title': 'Digital Document Checklist Before Appointments',
                'content': 'Customers frequently arrived without required documents. We created a digital document checklist sent via SMS before appointments.',
                'category': 'Document Management',
                'solution': {
                    'problem': 'Customers frequently arrived without required documents for business account opening.',
                    'solution': 'Created a digital document checklist that is sent via SMS and email 24 hours before the appointment.',
                    'result': 'Incomplete applications reduced by 40%. Customer satisfaction improved significantly.'
                }
            },
            {
                'branch_id': branches[1].id,
                'author_id': users[4].id,
                'post_type': 'SOLUTION',
                'title': 'Express Queue for Returning Customers',
                'content': 'Long queues were frustrating returning customers. We implemented an express lane for existing customers.',
                'category': 'Queue Management',
                'solution': {
                    'problem': 'Returning customers with simple transactions waited in the same queue as new customers.',
                    'solution': 'Implemented an express queue lane for returning customers with simple transactions.',
                    'result': 'Average wait time reduced by 35% for returning customers.'
                }
            },
            {
                'branch_id': branches[2].id,
                'author_id': users[3].id,
                'post_type': 'LESSON_LEARNED',
                'title': 'Peak Hour Staffing Adjustment',
                'content': 'We noticed consistent understaffing during 10AM-12PM. Adjusting shift schedules improved service delivery.',
                'category': 'Operations',
                'solution': None
            },
            {
                'branch_id': branches[0].id,
                'author_id': users[5].id,
                'post_type': 'TREND',
                'title': 'Increasing Demand for Business Accounts',
                'content': 'We observed a 60% increase in business account inquiries in the last quarter. This correlates with the growing SME sector.',
                'category': 'Market Trends',
                'solution': None
            },
        ]

        for post_data in posts_data:
            solution_data = post_data.pop('solution')
            post = BranchPost(**post_data)
            db.session.add(post)
            db.session.flush()
            if solution_data:
                sol = BranchSolution(
                    post_id=post.id,
                    problem=solution_data['problem'],
                    solution=solution_data['solution'],
                    result=solution_data['result'],
                    adopted_by_count=random.randint(1, 8)
                )
                db.session.add(sol)

        db.session.commit()
        print("Seed data created successfully!")
        print("\nDemo Credentials:")
        print("  Customer:    david@test.com / password123")
        print("  Officer:     officer1@luma.com / password123")
        print("  Manager:     manager1@luma.com / password123")
        print("  Admin:       admin@luma.com / password123")
        print("  Super Admin: superadmin@luma.com / password123")
        return True


def seed_if_empty(app):
    """Seed demo data only when the database has no users (used when SEED_DATA=1)."""
    return seed(app, drop=False, only_if_empty=True)


if __name__ == '__main__':
    from app import create_app
    _app = create_app()
    seed(_app, drop=True, only_if_empty=False)
