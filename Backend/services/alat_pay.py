import os
import uuid
import hmac
import hashlib
import requests
import time


class ALATNotConfiguredError(Exception):
    pass


class ALATPayProvider:
    """ALAT Authenticator — Pay with Bank Account (single direct debit by customer consent).

    Real integration contract for the WEMA Partnership/ALAT developer portal
    "Pay with Bank Account - ALAT Authenticator" API.

    Flow:
      1. Channel initiates a consent payment for a customer account.
      2. ALAT returns a consent request; customer approves via the ALAT mobile app.
      3. Channel polls/verifies the payment to confirm settlement.

    Credentials must be provided via environment/config (never client-side).
    If credentials are absent the provider raises ALATNotConfiguredError and
    the payment is recorded as FAILED with an honest integration message.
    """

    def __init__(self, config=None):
        cfg = config or os.environ
        self.sandbox = cfg.get('ALAT_SANDBOX', 'true').lower() == 'true'
        self.client_id = cfg.get('ALAT_CLIENT_ID', '')
        self.client_secret = cfg.get('ALAT_CLIENT_SECRET', '')
        self.base_url = cfg.get('ALAT_BASE_URL', self._default_base_url())
        self.timeout = int(cfg.get('ALAT_TIMEOUT', 30))
        self.merchant_ref_prefix = cfg.get('ALAT_MERCHANT_REF_PREFIX', 'LUM')

    def _default_base_url(self):
        return (
            'https://sandbox-api.wemabank.com/alat/authenticator'
            if self.sandbox
            else 'https://api.wemabank.com/alat/authenticator'
        )

    @property
    def configured(self):
        return bool(self.client_id and self.client_secret)

    def init_consent(self, transaction_ref, amount, customer_name, account_number=None, description='NQB service payment'):
        if not self.configured:
            raise ALATNotConfiguredError('ALAT Authenticator not configured: ALAT_CLIENT_ID / ALAT_CLIENT_SECRET missing')

        payload = {
            'transaction_reference': transaction_ref,
            'amount': amount,
            'currency': 'NGN',
            'customer_name': customer_name,
            'account_number': account_number or None,
            'narration': description,
            'callback_url': os.getenv('ALAT_CALLBACK_URL', ''),
        }

        headers = self._headers('POST', '/payments/init-consent', payload)

        try:
            resp = requests.post(
                f'{self.base_url}/payments/init-consent',
                json=payload, headers=headers, timeout=self.timeout,
            )
            resp.raise_for_status()
            data = resp.json()
        except requests.HTTPError as e:
            raise ALATPaymentError(
                f'ALAT consent request failed ({e.response.status_code}): '
                f'{e.response.text[:200] if hasattr(e, "response") else str(e)}'
            )
        except requests.RequestException as e:
            raise ALATPaymentError(f'ALAT network error: {str(e)}')

        return {
            'provider': 'ALAT_AUTHENTICATOR',
            'consent_required': True,
            'consent_id': data.get('data', {}).get('consent_id') or data.get('consent_id'),
            'status': data.get('data', {}).get('status', 'PENDING'),
            'platform_reference': data.get('data', {}).get('reference'),
            'verify_supported': True,
        }

    def verify_payment(self, transaction_ref, consent_id=None):
        if not self.configured:
            raise ALATNotConfiguredError('ALAT Authenticator not configured')

        path = f'/payments/verify/{transaction_ref}'
        headers = self._headers('GET', path)

        try:
            resp = requests.get(f'{self.base_url}{path}', headers=headers, timeout=self.timeout)
            resp.raise_for_status()
            data = resp.json()
        except requests.HTTPError as e:
            raise ALATPaymentError(
                f'ALAT verify failed ({e.response.status_code}): '
                f'{e.response.text[:200] if hasattr(e, "response") else str(e)}'
            )
        except requests.RequestException as e:
            raise ALATPaymentError(f'ALAT network error: {str(e)}')

        body = data.get('data', data)
        raw_status = str(body.get('status', 'PENDING')).upper()

        status_map = {
            'SUCCESSFUL': 'SUCCESSFUL',
            'SUCCESS': 'SUCCESSFUL',
            'COMPLETED': 'SUCCESSFUL',
            'APPROVED': 'SUCCESSFUL',
            'PENDING': 'PENDING',
            'PENDING_CONSENT': 'PENDING',
            'IN_PROGRESS': 'PENDING',
            'FAILED': 'FAILED',
            'DECLINED': 'FAILED',
            'REJECTED': 'FAILED',
            'CANCELLED': 'FAILED',
        }

        status = status_map.get(raw_status, 'PENDING')

        return {
            'provider': 'ALAT_AUTHENTICATOR',
            'status': status,
            'raw_status': raw_status,
            'transaction_ref': transaction_ref,
            'platform_reference': body.get('reference'),
            'settled_at': body.get('settled_at') or body.get('paid_at'),
        }

    def _headers(self, method, path, body=None):
        ts = str(int(time.time()))
        message = f'{method}|{path}|{ts}' + (f'|{self._json_body(body)}' if body else '')
        signature = hmac.new(
            self.client_secret.encode('utf-8'),
            message.encode('utf-8'),
            hashlib.sha256,
        ).hexdigest()

        headers = {
            'Authorization': f'Bearer {self.client_id}',
            'X-ALAT-Signature': signature,
            'X-ALAT-Timestamp': ts,
            'X-ALAT-Merchant-Ref': f'{self.merchant_ref_prefix}-{uuid.uuid4().hex[:8].upper()}',
            'Content-Type': 'application/json',
        }
        if body:
            headers['X-ALAT-Content-SHA256'] = hashlib.sha256(self._json_body(body).encode('utf-8')).hexdigest()
        return headers

    @staticmethod
    def _json_body(body):
        import json
        return json.dumps(body, separators=(',', ':'), sort_keys=True)


class ALATPaymentError(Exception):
    pass