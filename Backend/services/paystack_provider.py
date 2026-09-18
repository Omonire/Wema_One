import os
import requests


class PaystackNotConfiguredError(Exception):
    pass


class PaystackPaymentError(Exception):
    pass


class PaystackProvider:
    """Paystack payment provider - fallback when ALAT is not configured.

    Flow:
      1. Initialize a transaction with Paystack
      2. Customer completes payment via Paystack checkout
      3. Verify the transaction to confirm settlement

    Credentials must be provided via environment/config (never client-side).
    If credentials are absent the provider raises PaystackNotConfiguredError.
    
    API Docs: https://paystack.com/docs/api/transaction/
    """

    def __init__(self, config=None):
        cfg = config or os.environ
        self.secret_key = cfg.get('PAYSTACK_SECRET_KEY', '')
        self.base_url = 'https://api.paystack.co'
        self.timeout = int(cfg.get('PAYSTACK_TIMEOUT', 30))

    @property
    def configured(self):
        return bool(self.secret_key)

    def init_transaction(self, email, amount, reference=None, callback_url=None, metadata=None):
        """Initialize a Paystack transaction.
        
        Args:
            email: Customer's email address
            amount: Amount in kobo (NGN) or cents (USD)
            reference: Unique transaction reference
            callback_url: URL to redirect after payment
            metadata: Additional metadata for the transaction
            
        Returns:
            dict with authorization_url, access_code, reference
        """
        if not self.configured:
            raise PaystackNotConfiguredError('Paystack not configured: PAYSTACK_SECRET_KEY missing')

        payload = {
            'email': email,
            'amount': amount,
            'currency': 'NGN',
        }
        
        if reference:
            payload['reference'] = reference
        if callback_url:
            payload['callback_url'] = callback_url
        if metadata:
            payload['metadata'] = metadata

        headers = {
            'Authorization': f'Bearer {self.secret_key}',
            'Content-Type': 'application/json',
        }

        try:
            resp = requests.post(
                f'{self.base_url}/transaction/initialize',
                json=payload,
                headers=headers,
                timeout=self.timeout,
            )
            resp.raise_for_status()
            data = resp.json()
        except requests.HTTPError as e:
            raise PaystackPaymentError(
                f'Paystack initialization failed ({e.response.status_code}): '
                f'{e.response.text[:200] if hasattr(e, "response") else str(e)}'
            )
        except requests.RequestException as e:
            raise PaystackPaymentError(f'Paystack network error: {str(e)}')

        if not data.get('status'):
            raise PaystackPaymentError(data.get('message', 'Paystack initialization failed'))

        result = data.get('data', {})
        return {
            'provider': 'PAYSTACK',
            'authorization_url': result.get('authorization_url'),
            'access_code': result.get('access_code'),
            'reference': result.get('reference'),
            'status': 'PENDING',
        }

    def verify_transaction(self, reference):
        """Verify a Paystack transaction.
        
        Args:
            reference: Transaction reference
            
        Returns:
            dict with status, amount, gateway_response
        """
        if not self.configured:
            raise PaystackNotConfiguredError('Paystack not configured')

        headers = {
            'Authorization': f'Bearer {self.secret_key}',
            'Content-Type': 'application/json',
        }

        try:
            resp = requests.get(
                f'{self.base_url}/transaction/verify/{reference}',
                headers=headers,
                timeout=self.timeout,
            )
            resp.raise_for_status()
            data = resp.json()
        except requests.HTTPError as e:
            raise PaystackPaymentError(
                f'Paystack verification failed ({e.response.status_code}): '
                f'{e.response.text[:200] if hasattr(e, "response") else str(e)}'
            )
        except requests.RequestException as e:
            raise PaystackPaymentError(f'Paystack network error: {str(e)}')

        if not data.get('status'):
            return {
                'provider': 'PAYSTACK',
                'status': 'FAILED',
                'raw_status': 'VERIFICATION_FAILED',
                'gateway_response': data.get('message', 'Verification failed'),
            }

        result = data.get('data', {})
        paystack_status = str(result.get('status', '')).upper()
        
        status_map = {
            'SUCCESS': 'SUCCESSFUL',
            'ABANDONED': 'FAILED',
            'FAILED': 'FAILED',
            'REVERSED': 'FAILED',
        }
        
        status = status_map.get(paystack_status, 'PENDING')

        return {
            'provider': 'PAYSTACK',
            'status': status,
            'raw_status': paystack_status,
            'amount': result.get('amount'),
            'gateway_response': result.get('gateway_response'),
            'paid_at': result.get('paid_at'),
            'channel': result.get('channel'),
            'currency': result.get('currency'),
        }
