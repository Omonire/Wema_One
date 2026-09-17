from services.ai_service import AIService


class SocialPulseService:
    def __init__(self):
        self.ai = AIService()

    def analyze(self, content, feedback_type='FEEDBACK'):
        sentiment_result = self.ai._mock_sentiment(content)
        topic = self.ai._mock_topic_extraction(content)
        category = self.ai._mock_category(content, feedback_type)
        priority = self.ai._mock_priority(sentiment_result.get('score'), feedback_type)

        key_phrases = self._extract_key_phrases(content)
        ai_notes = self._generate_notes(content, sentiment_result, topic, category, feedback_type)

        return {
            'sentiment': sentiment_result.get('sentiment', 'Neutral'),
            'sentiment_score': sentiment_result.get('score', 0.5),
            'topic': topic,
            'category': category,
            'priority': priority,
            'key_phrases': key_phrases,
            'ai_notes': ai_notes
        }

    def _extract_key_phrases(self, content):
        words = content.lower().split()
        stop_words = {'i', 'the', 'a', 'an', 'is', 'was', 'were', 'are', 'be', 'been',
                      'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
                      'could', 'should', 'may', 'might', 'shall', 'can', 'to', 'of', 'in',
                      'for', 'on', 'with', 'at', 'by', 'from', 'it', 'this', 'that', 'my',
                      'your', 'we', 'they', 'he', 'she', 'and', 'or', 'but', 'not', 'so',
                      'if', 'very', 'just', 'also', 'about', 'which', 'who', 'whom', 'what',
                      'when', 'where', 'how', 'all', 'each', 'than', 'them', 'then', 'these',
                      'those', 'there', 'here', 'some', 'any', 'no', 'only', 'own', 'same',
                      'too', 'such'}
        meaningful = [w for w in words if len(w) > 3 and w.strip('.,!?;:') not in stop_words]
        return list(set(meaningful[:8]))

    def _generate_notes(self, content, sentiment_result, topic, category, feedback_type):
        lines = []
        lines.append(f"Feedback type: {feedback_type}")
        lines.append(f"Detected sentiment: {sentiment_result.get('sentiment', 'Neutral')} "
                     f"(score: {sentiment_result.get('score', 0.5)})")
        lines.append(f"Primary topic: {topic}")
        lines.append(f"Categorized under: {category}")
        if feedback_type == 'COMPLAINT':
            lines.append("This is a customer complaint and may require follow-up.")
        elif feedback_type == 'QUESTION':
            lines.append("Customer has a question that may indicate information gaps.")
        return ' '.join(lines)
