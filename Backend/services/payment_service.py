import uuid
import random


class PaymentService:
    def __init__(self):
        self.sandbox_mode = True

    def process_payment(self, payment):
        if self.sandbox_mode:
            return self._sandbox_process(payment)
        return self._mock_wema_pay(payment)

    def _sandbox_process(self, payment):
        success_rate = 0.92
        if random.random() < success_rate:
            return {
                'success': True,
                'transaction_id': f"WMPAY-{uuid.uuid4().hex[:10].upper()}",
                'status': 'SUCCESSFUL',
                'message': 'Payment processed successfully (sandbox)',
                'amount': payment.amount,
                'currency': payment.currency
            }
        return {
            'success': False,
            'error': 'PAYMENT_DECLINED',
            'message': 'Payment was declined (sandbox simulation)',
            'amount': payment.amount,
            'currency': payment.currency
        }

    def _mock_wema_pay(self, payment):
        return {
            'success': True,
            'transaction_id': f"WEMA-{uuid.uuid4().hex[:10].upper()}",
            'status': 'PENDING',
            'message': 'Payment initiated via WemaPay (integration pending)',
            'redirect_url': 'https://pay.wemabank.com/mock-redirect'
        }
