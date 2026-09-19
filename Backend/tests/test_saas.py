import os
import sys
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


def _register(client, email, role='CUSTOMER', org_slug=None):
    payload = {
        'email': email,
        'password': 'TestPass123!!',
        'first_name': 'Test',
        'last_name': 'User',
        'role': role,
    }
    if org_slug:
        payload['organization_slug'] = org_slug
    resp = client.post('/api/auth/register', json=payload)
    assert resp.status_code == 201, resp.get_json()
    return resp.get_json()['data']['token']


def test_create_workspace(client):
    resp = client.post('/api/organizations/', json={
        'name': 'Acme Health',
        'type': 'HOSPITAL',
        'email': 'ceo@acme.com',
        'password': 'TestPass123!!',
        'first_name': 'Ada',
        'last_name': 'CEO',
    })
    data = resp.get_json()
    assert resp.status_code == 201, data
    assert data['success'] is True
    assert data['data']['organization']['slug'] == 'acme-health'
    assert data['data']['organization']['type'] == 'HOSPITAL'
    assert data['data']['user']['role'] == 'ADMIN'
    assert 'token' in data['data']


def test_organization_slug_uniqueness(client):
    client.post('/api/organizations/', json={
        'name': 'Zeta Bank', 'email': 'zeta@bank.com', 'password': 'TestPass123!!',
    })
    dup = client.post('/api/organizations/', json={
        'name': 'Zeta Bank', 'email': 'zeta2@bank.com', 'password': 'TestPass123!!',
    })
    data = dup.get_json()
    assert dup.status_code == 201
    assert data['data']['organization']['slug'] == 'zeta-bank-2'


def test_list_organizations_public(client):
    client.post('/api/organizations/', json={
        'name': 'Omega Telecom', 'type': 'TELECOM',
        'email': 'ceo@omega.com', 'password': 'TestPass123!!',
    })
    resp = client.get('/api/organizations/')
    data = resp.get_json()
    assert resp.status_code == 200
    slugs = {o['slug'] for o in data['data']}
    assert 'omega-telecom' in slugs


def test_get_organization_by_slug(client):
    client.post('/api/organizations/', json={
        'name': 'Delta Insurance', 'type': 'INSURANCE',
        'email': 'ceo@delta.com', 'password': 'TestPass123!!',
    })
    resp = client.get('/api/organizations/delta-insurance')
    data = resp.get_json()
    assert resp.status_code == 200
    assert data['data']['plan'] == 'FREE'


def test_register_with_org(client):
    client.post('/api/organizations/', json={
        'name': 'Gamma Bank', 'email': 'gm@gamma.com', 'password': 'TestPass123!!',
    })
    token = _register(client, 'customer@gamma.com', org_slug='gamma-bank')
    me = client.get('/api/organizations/me', headers={'Authorization': f'Bearer {token}'})
    data = me.get_json()
    assert me.status_code == 200
    assert data['data']['slug'] == 'gamma-bank'


def test_tenant_isolation(client):
    client.post('/api/organizations/', json={
        'name': 'Isolation One', 'email': 'i1@one.com', 'password': 'TestPass123!!',
    })
    client.post('/api/organizations/', json={
        'name': 'Isolation Two', 'email': 'i2@two.com', 'password': 'TestPass123!!',
    })
    one = client.get('/api/organizations/me', headers={
        'Authorization': f"Bearer {_register(client, 'c1@one.com', org_slug='isolation-one')}"})
    two = client.get('/api/organizations/me', headers={
        'Authorization': f"Bearer {_register(client, 'c2@two.com', org_slug='isolation-two')}"})
    assert one.get_json()['data']['id'] != two.get_json()['data']['id']


def test_public_endpoints_scope_to_org(client):
    client.post('/api/organizations/', json={
        'name': 'Scoped Bank', 'email': 'sb@scoped.com', 'password': 'TestPass123!!',
    })
    resp = client.get('/api/services/?org=scoped-bank')
    assert resp.status_code == 200
    assert resp.get_json()['success'] is True


def test_platform_requires_super_admin(client):
    token = _register(client, 'regular@plat.com', role='CUSTOMER')
    forbidden = client.get('/api/organizations/platform', headers={'Authorization': f'Bearer {token}'})
    assert forbidden.status_code == 403

    admin_token = _register(client, 'supa@plat.com', role='SUPER_ADMIN')
    ok = client.get('/api/organizations/platform', headers={'Authorization': f'Bearer {admin_token}'})
    data = ok.get_json()
    assert ok.status_code == 200
    assert data['success'] is True


def test_platform_update_plan(client):
    client.post('/api/organizations/', json={
        'name': 'Plan Test Corp', 'email': 'pt@plan.com', 'password': 'TestPass123!!',
    })
    orgs = client.get('/api/organizations/platform', headers={
        'Authorization': f"Bearer {_register(client, 'pta@plan.com', role='SUPER_ADMIN')}"}).get_json()['data']
    target = next(o for o in orgs if o['slug'] == 'plan-test-corp')

    patch = client.patch(f"/api/organizations/platform/{target['id']}", json={'plan': 'PRO'},
                         headers={'Authorization': f"Bearer {_register(client, 'ptb@plan.com', role='SUPER_ADMIN')}"})
    data = patch.get_json()
    assert patch.status_code == 200
    assert data['data']['plan'] == 'PRO'