import random


class AIService:
    def __init__(self):
        self.enabled = False
        self.provider = 'mock'

    def analyze_text(self, text, task='general'):
        return {
            'provider': 'mock',
            'task': task,
            'text_length': len(text),
            'result': self._mock_analysis(text, task)
        }

    def _mock_analysis(self, text, task):
        if task == 'sentiment':
            return self._mock_sentiment(text)
        elif task == 'document_verification':
            return self._mock_document_verification(text)
        elif task == 'topic_extraction':
            return self._mock_topic_extraction(text)
        return {}

    def _mock_sentiment(self, text):
        negative_words = ['bad', 'poor', 'terrible', 'worst', 'hate', 'slow', 'rude', 'long wait', 'confused', 'frustrated', 'missing', 'problem', 'issue', 'complaint', 'disappointed', 'awful']
        positive_words = ['good', 'great', 'excellent', 'fast', 'helpful', 'friendly', 'efficient', 'smooth', 'easy', 'love', 'amazing', 'wonderful', 'satisfied', 'thank']

        text_lower = text.lower()
        neg_count = sum(1 for w in negative_words if w in text_lower)
        pos_count = sum(1 for w in positive_words if w in text_lower)

        if neg_count > pos_count:
            return {
                'sentiment': 'Negative',
                'score': round(0.2 + random.uniform(0, 0.2), 2)
            }
        elif pos_count > neg_count:
            return {
                'sentiment': 'Positive',
                'score': round(0.7 + random.uniform(0, 0.2), 2)
            }
        return {
            'sentiment': 'Neutral',
            'score': round(0.4 + random.uniform(0, 0.2), 2)
        }

    def _mock_topic_extraction(self, text):
        text_lower = text.lower()
        topic_map = {
            'document': 'Business Account Documentation',
            'queue': 'Queue Management',
            'wait': 'Waiting Times',
            'payment': 'Payment Processing',
            'branch': 'Branch Service',
            'account': 'Account Services',
            'card': 'Card Services',
            'loan': 'Loan Application',
            'service': 'General Service',
            'staff': 'Staff Interaction',
            'app': 'Digital Banking',
            'online': 'Online Banking'
        }
        for keyword, topic in topic_map.items():
            if keyword in text_lower:
                return topic
        return 'General Banking'

    def _mock_category(self, text, fb_type):
        text_lower = text.lower()
        if fb_type == 'COMPLAINT':
            return 'Customer Complaint'
        if fb_type == 'QUESTION':
            return 'Customer Inquiry'

        category_map = {
            'document': 'Onboarding',
            'queue': 'Branch Operations',
            'wait': 'Branch Operations',
            'payment': 'Payments',
            'account': 'Account Management',
            'card': 'Card Services',
            'loan': 'Lending',
            'staff': 'Customer Service',
            'app': 'Digital Experience'
        }
        for keyword, category in category_map.items():
            if keyword in text_lower:
                return category
        return 'General'

    def _mock_priority(self, sentiment_score, fb_type):
        if fb_type == 'COMPLAINT':
            if sentiment_score and sentiment_score < 0.3:
                return 'High'
            return 'Medium'
        if fb_type == 'QUESTION':
            return 'Low'
        if sentiment_score and sentiment_score < 0.3:
            return 'High'
        elif sentiment_score and sentiment_score > 0.7:
            return 'Low'
        return 'Medium'
