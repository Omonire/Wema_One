import uuid
from datetime import datetime
from services.alat_pay import ALATPayProvider, ALATNotConfiguredError, ALATPaymentError
from services.paystack_provider import PaystackProvider, PaystackNotConfiguredError, PaystackPaymentError


class PaymentService:
    """Payment orchestration with provider fallback and demo mode.

    Priority:
      1. ALAT Authenticator (primary - Wema Bank integration)
      2. Paystack (fallback when ALAT not configured)
      3. Demo mode (auto-approve when no provider configured)

    In demo mode, payments are instantly approved for testing/demo purposes.
    """

    def __init__(self):
        self.alat = ALATPayProvider()
        self.paystack = PaystackProvider()
        
        # Select the best available provider
        if self.alat.configured:
            self.provider = self.alat
            self.provider_name = 'ALAT_AUTHENTICATOR'
        elif self.paystack.configured:
            self.provider = self.paystack
            self.provider_name = 'PAYSTACK'
        else:
            self.provider = None
            self.provider_name = 'DEMO'

    def init_payment(self, payment):
        """Phase 1 — initiate payment via the best available provider.
        
        If no provider is configured, auto-approve in demo mode.
        """
        
        # Try ALAT first
        if self.alat.configured:
            try:
                result = self.alat.init_consent(
                    transaction_ref=payment.transaction_ref,
                    amount=payment.amount,
                    customer_name=f"{payment.customer.first_name} {payment.customer.last_name}".strip() if payment.customer else 'Customer',
                    account_number=None,
                    description=payment.narration or 'NQB service payment',
                )
                return {
                    'success': True,
                    'status': 'PENDING',
                    'consent_required': result.get('consent_required', False),
                    'consent_id': result.get('consent_id'),
                    'provider': result.get('provider'),
                    'message': 'Payment initiated. Customer consent required via ALAT app.',
                }
            except ALATNotConfiguredError:
                pass  # Fall through to Paystack
            except ALATPaymentError as e:
                return {
                    'success': False,
                    'status': 'FAILED',
                    'error': 'ALAT_INIT_ERROR',
                    'message': str(e),
                }

        # Fallback to Paystack
        if self.paystack.configured:
            try:
                customer_email = getattr(payment.customer, 'email', None) if payment.customer else None
                if not customer_email:
                    customer_email = f"customer@nqb.app"
                
                result = self.paystack.init_transaction(
                    email=customer_email,
                    amount=int(payment.amount * 100),  # Convert to kobo
                    reference=payment.transaction_ref,
                    callback_url=None,
                    metadata={
                        'payment_id': payment.id,
                        'service_id': payment.service_id,
                        'branch_id': payment.branch_id,
                    },
                )
                return {
                    'success': True,
                    'status': 'PENDING',
                    'authorization_url': result.get('authorization_url'),
                    'access_code': result.get('access_code'),
                    'provider': result.get('provider'),
                    'message': 'Payment initiated. Complete payment via Paystack checkout.',
                }
            except PaystackNotConfiguredError:
                pass  # Fall through to demo mode
            except PaystackPaymentError as e:
                return {
                    'success': False,
                    'status': 'FAILED',
                    'error': 'PAYSTACK_INIT_ERROR',
                    'message': str(e),
                }

        # Demo mode: auto-approve payment
        return {
            'success': True,
            'status': 'SUCCESSFUL',
            'provider': 'DEMO',
            'consent_required': False,
            'message': 'Payment auto-approved (demo mode). No real payment processed.',
        }

    def verify_payment(self, payment):
        """Phase 2 — confirm settlement status from the payment provider.
        
        In demo mode, always return success.
        """
        
        # Demo mode: auto-verify
        if self.provider_name == 'DEMO' or not self.provider:
            return {
                'success': True,
                'status': 'SUCCESSFUL',
                'provider': 'DEMO',
                'platform_reference': f'DEMO-{uuid.uuid4().hex[:8].upper()}',
                'message': 'Payment verified (demo mode)',
            }
        
        # Determine which provider was used based on the payment record
        provider_used = getattr(payment, 'provider', None) or self.provider_name
        
        if provider_used == 'ALAT_AUTHENTICATOR' or (self.alat.configured and not self.paystack.configured):
            try:
                result = self.alat.verify_payment(
                    transaction_ref=payment.transaction_ref,
                    consent_id=payment.alat_consent_id,
                )
                return {
                    'success': result['status'] == 'SUCCESSFUL',
                    'status': result['status'],
                    'provider': result.get('provider'),
                    'platform_reference': result.get('platform_reference'),
                    'message': 'Payment confirmed' if result['status'] == 'SUCCESSFUL' else f"Payment status: {result['status']}",
                }
            except (ALATNotConfiguredError, ALATPaymentError) as e:
                return {'success': False, 'status': 'FAILED', 'error': 'ALAT_VERIFY_ERROR', 'message': str(e)}

        elif provider_used == 'PAYSTACK' or self.paystack.configured:
            try:
                result = self.paystack.verify_transaction(payment.transaction_ref)
                return {
                    'success': result['status'] == 'SUCCESSFUL',
                    'status': result['status'],
                    'provider': result.get('provider'),
                    'platform_reference': result.get('gateway_response'),
                    'message': 'Payment confirmed' if result['status'] == 'SUCCESSFUL' else f"Payment status: {result['status']}",
                }
            except (PaystackNotConfiguredError, PaystackPaymentError) as e:
                return {'success': False, 'status': 'FAILED', 'error': 'PAYSTACK_VERIFY_ERROR', 'message': str(e)}

        return {'success': False, 'status': 'FAILED', 'error': 'NO_PAYMENT_PROVIDER', 'message': 'No payment provider configured'}

    @staticmethod
    def build_transaction_ref():
        return f"LUM-{uuid.uuid4().hex[:12].upper()}"
