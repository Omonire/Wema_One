import os
import sys
import json
import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from extensions import db as _db


@pytest.fixture(scope='session')
def app():
    app = create_app('testing')
    with app.app_context():
        _db.create_all()
        yield app
        _db.drop_all()


@pytest.fixture(scope='function')
def client(app):
    return app.test_client()


def test_health(client):
    resp = client.get('/api/admin/health')
    data = resp.get_json()
    assert resp.status_code == 200
    assert data['success'] is True
    assert data['data']['status'] == 'healthy'


def test_get_services(client):
    resp = client.get('/api/services/')
    data = resp.get_json()
    assert resp.status_code == 200
    assert data['success'] is True


def test_get_branches(client):
    resp = client.get('/api/branches/')
    data = resp.get_json()
    assert resp.status_code == 200
    assert data['success'] is True


def test_register_and_login(client):
    resp = client.post('/api/auth/register', json={
        'email': 'test_user@example.com',
        'password': 'testpass123',
        'first_name': 'Test',
        'last_name': 'User'
    })
    data = resp.get_json()
    assert resp.status_code == 201
    assert data['success'] is True
    assert 'token' in data['data']

    resp2 = client.post('/api/auth/login', json={
        'email': 'test_user@example.com',
        'password': 'testpass123'
    })
    data2 = resp2.get_json()
    assert resp2.status_code == 200
    assert data2['success'] is True


def test_register_duplicate_email(client):
    client.post('/api/auth/register', json={
        'email': 'dup@example.com',
        'password': 'pass123',
        'first_name': 'Dup',
        'last_name': 'Test'
    })
    resp = client.post('/api/auth/register', json={
        'email': 'dup@example.com',
        'password': 'pass123',
        'first_name': 'Dup2',
        'last_name': 'Test'
    })
    assert resp.status_code == 409


def test_auth_me(client):
    client.post('/api/auth/register', json={
        'email': 'me@example.com',
        'password': 'pass123',
        'first_name': 'Me',
        'last_name': 'Test'
    })
    login_resp = client.post('/api/auth/login', json={
        'email': 'me@example.com',
        'password': 'pass123'
    })
    token = login_resp.get_json()['data']['token']

    resp = client.get('/api/auth/me', headers={'Authorization': f'Bearer {token}'})
    data = resp.get_json()
    assert resp.status_code == 200
    assert data['data']['email'] == 'me@example.com'


def test_create_appointment(client):
    client.post('/api/auth/register', json={
        'email': 'appt_test@example.com',
        'password': 'pass123',
        'first_name': 'Appt',
        'last_name': 'Test'
    })
    login_resp = client.post('/api/auth/login', json={
        'email': 'appt_test@example.com',
        'password': 'pass123'
    })
    token = login_resp.get_json()['data']['token']

    resp = client.post('/api/appointments/', json={
        'branch_id': 1,
        'service_id': 1,
        'appointment_date': '2026-09-20',
        'appointment_time': '10:00'
    }, headers={'Authorization': f'Bearer {token}'})
    assert resp.status_code == 201
    assert resp.get_json()['success'] is True


def test_create_queue_ticket(client):
    client.post('/api/auth/register', json={
        'email': 'queue_test@example.com',
        'password': 'pass123',
        'first_name': 'Queue',
        'last_name': 'Test'
    })
    login_resp = client.post('/api/auth/login', json={
        'email': 'queue_test@example.com',
        'password': 'pass123'
    })
    token = login_resp.get_json()['data']['token']

    resp = client.post('/api/queues/', json={
        'branch_id': 1,
        'service_id': 1
    }, headers={'Authorization': f'Bearer {token}'})
    data = resp.get_json()
    assert resp.status_code == 201
    assert data['success'] is True
    assert 'WMA-' in data['data']['ticket_number']


def test_create_feedback(client):
    client.post('/api/auth/register', json={
        'email': 'fb_test@example.com',
        'password': 'pass123',
        'first_name': 'FB',
        'last_name': 'Test'
    })
    login_resp = client.post('/api/auth/login', json={
        'email': 'fb_test@example.com',
        'password': 'pass123'
    })
    token = login_resp.get_json()['data']['token']

    resp = client.post('/api/feedback/', json={
        'content': 'The service was terrible and slow.',
        'type': 'COMPLAINT',
        'branch_id': 1,
        'rating': 2
    }, headers={'Authorization': f'Bearer {token}'})
    data = resp.get_json()
    assert resp.status_code == 201
    assert data['success'] is True
    assert 'analysis' in data['data']


def test_create_payment(client):
    client.post('/api/auth/register', json={
        'email': 'pay_test@example.com',
        'password': 'pass123',
        'first_name': 'Pay',
        'last_name': 'Test'
    })
    login_resp = client.post('/api/auth/login', json={
        'email': 'pay_test@example.com',
        'password': 'pass123'
    })
    token = login_resp.get_json()['data']['token']

    resp = client.post('/api/payments/', json={
        'service_id': 1,
        'amount': 5000
    }, headers={'Authorization': f'Bearer {token}'})
    data = resp.get_json()

    # Without ALAT credentials the payment must FAIL honestly (never a fake success).
    assert data['error'] == 'ALAT_NOT_CONFIGURED'


def test_create_branchconnect_post(client):
    client.post('/api/auth/register', json={
        'email': 'bc_test@example.com',
        'password': 'pass123',
        'first_name': 'BC',
        'last_name': 'Test'
    })
    login_resp = client.post('/api/auth/login', json={
        'email': 'bc_test@example.com',
        'password': 'pass123'
    })
    token = login_resp.get_json()['data']['token']

    resp = client.post('/api/branchconnect/posts', json={
        'branch_id': 1,
        'title': 'Test Solution',
        'content': 'A test solution for testing',
        'post_type': 'SOLUTION',
        'solution': {
            'problem': 'Test problem',
            'solution': 'Test solution description',
            'result': 'Test result'
        }
    }, headers={'Authorization': f'Bearer {token}'})
    assert resp.status_code == 201
    assert resp.get_json()['success'] is True


def test_unauthorized_access(client):
    resp = client.get('/api/users/')
    assert resp.status_code == 401
