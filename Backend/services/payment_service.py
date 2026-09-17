import uuid
from services.alat_pay import ALATPayProvider, ALATNotConfiguredError, ALATPaymentError


class PaymentService:
    """Payment orchestration — ALAT Authenticator is the only payment provider.

    No demo/mock simulation. If ALAT is not configured, payments fail loudly
    with an honest integration message (never a fake success).
    """

    def __init__(self):
        self.provider = ALATPayProvider()

    def init_payment(self, payment):
        """Phase 1 — initiate consent-based debit via ALAT Authenticator."""
        try:
            result = self.provider.init_consent(
                transaction_ref=payment.transaction_ref,
                amount=payment.amount,
                customer_name=f"{payment.customer.first_name} {payment.customer.last_name}".strip() if payment.customer else 'Customer',
                account_number=None,
                description=payment.narration or 'Luma service payment',
            )
        except ALATNotConfiguredError as e:
            return {
                'success': False,
                'status': 'FAILED',
                'error': 'ALAT_NOT_CONFIGURED',
                'message': str(e),
            }
        except ALATPaymentError as e:
            return {
                'success': False,
                'status': 'FAILED',
                'error': 'ALAT_INIT_ERROR',
                'message': str(e),
            }

        return {
            'success': True,
            'status': 'PENDING',
            'consent_required': result.get('consent_required', False),
            'consent_id': result.get('consent_id'),
            'provider': result.get('provider'),
            'message': 'Payment initiated. Customer consent required via ALAT app.',
        }

    def verify_payment(self, payment):
        """Phase 2 — confirm settlement status from ALAT."""
        try:
            result = self.provider.verify_payment(
                transaction_ref=payment.transaction_ref,
                consent_id=payment.alat_consent_id,
            )
        except ALATNotConfiguredError as e:
            return {'success': False, 'status': 'FAILED', 'error': 'ALAT_NOT_CONFIGURED', 'message': str(e)}
        except ALATPaymentError as e:
            return {'success': False, 'status': 'FAILED', 'error': 'ALAT_VERIFY_ERROR', 'message': str(e)}

        return {
            'success': result['status'] == 'SUCCESSFUL',
            'status': result['status'],
            'provider': result.get('provider'),
            'platform_reference': result.get('platform_reference'),
            'message': 'Payment confirmed' if result['status'] == 'SUCCESSFUL' else f"Payment status: {result['status']}",
        }

    @staticmethod
    def build_transaction_ref():
        return f"LUM-{uuid.uuid4().hex[:12].upper()}"