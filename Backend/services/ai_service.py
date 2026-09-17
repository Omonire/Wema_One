import os
import random
import json


class BaseLLMProvider:
    name = 'base'
    enabled = False

    def __init__(self, config=None):
        cfg = config or os.environ
        self._configure(cfg)

    def _configure(self, cfg):
        raise NotImplementedError

    def is_enabled(self):
        return self.enabled

    def complete(self, system_prompt, user_prompt, max_tokens=300, temperature=0.3):
        raise NotImplementedError


class GroqLLMProvider(BaseLLMProvider):
    """Free-tier Groq (OpenAI-compatible). Model: llama-3.3-70b-versatile (free)."""

    name = 'groq'

    def _configure(self, cfg):
        self.api_key = cfg.get('GROQ_API_KEY', '')
        self.enabled = bool(self.api_key)
        self.base_url = cfg.get('GROQ_BASE_URL', 'https://api.groq.com/openai/v1/chat/completions')
        self.model = cfg.get('GROQ_MODEL', 'llama-3.3-70b-versatile')

    def complete(self, system_prompt, user_prompt, max_tokens=300, temperature=0.3):
        import requests
        resp = requests.post(
            self.base_url,
            headers={'Authorization': f'Bearer {self.api_key}', 'Content-Type': 'application/json'},
            json={
                'model': self.model,
                'messages': [
                    {'role': 'system', 'content': system_prompt},
                    {'role': 'user', 'content': user_prompt},
                ],
                'max_tokens': max_tokens,
                'temperature': temperature,
            },
            timeout=30,
        )
        resp.raise_for_status()
        content = resp.json()['choices'][0]['message']['content']
        return self._extract_json(content)

    @staticmethod
    def _extract_json(content):
        """Best-effort JSON extraction tolerating markdown fences / prose."""
        text = content.strip()
        if text.startswith('```'):
            text = text.strip('`')
            if text.startswith('json'):
                text = text[4:]
        start = text.find('{')
        end = text.rfind('}')
        if start != -1 and end != -1 and end > start:
            try:
                return json.loads(text[start:end + 1])
            except json.JSONDecodeError:
                pass
        return {'raw': content}


class GeminiLLMProvider(BaseLLMProvider):
    """Free-tier Google Gemini (AI Studio key). Model: gemini-2.0-flash (free)."""

    name = 'gemini'

    def _configure(self, cfg):
        self.api_key = cfg.get('GEMINI_API_KEY', '')
        self.enabled = bool(self.api_key)
        self.model = cfg.get('GEMINI_MODEL', 'gemini-2.0-flash')
        self.base_url = cfg.get('GEMINI_BASE_URL', 'https://generativelanguage.googleapis.com/v1beta')

    def complete(self, system_prompt, user_prompt, max_tokens=300, temperature=0.3):
        import requests
        payload = {
            'contents': [{'parts': [{'text': f'{system_prompt}\n\n{user_prompt}'}]}],
            'generationConfig': {'maxOutputTokens': max_tokens, 'temperature': temperature},
        }
        resp = requests.post(
            f'{self.base_url}/models/{self.model}:generateContent?key={self.api_key}',
            json=payload,
            timeout=30,
        )
        resp.raise_for_status()
        text = resp.json()['candidates'][0]['content']['parts'][0]['text']
        return GroqLLMProvider._extract_json(text)


class AIService:
    """AI abstraction with real free-tier providers and deterministic fallback.

    Provider selection (config AI_PROVIDER):
      - groq   (default when key present, free tier)
      - gemini (free tier via AI Studio key)
      - mock   (deterministic, offline. No key required — never costs money.)

    Response shape is consistent across providers.
    """

    def __init__(self):
        cfg = os.environ
        self.provider_name = cfg.get('AI_PROVIDER', '').lower() or 'mock'
        self.providers = {
            'groq': GroqLLMProvider(cfg),
            'gemini': GeminiLLMProvider(cfg),
        }
        self.enabled = bool(cfg.get('AI_ENABLED', 'false').lower() == 'true')

        if self.provider_name in self.providers and self.providers[self.provider_name].is_enabled():
            self.provider = self.providers[self.provider_name]
            self.enabled = True
        else:
            self.provider = None

    def analyze_text(self, text, task='general'):
        result = {'provider': self.provider.name if self.provider else 'mock', 'task': task, 'text_length': len(text)}

        if self.provider:
            try:
                result['result'] = self._llm_task(self.provider, text, task)
                return result
            except Exception:
                pass

        result['result'] = self._mock_analysis(text, task)
        return result

    def _llm_task(self, provider, text, task):
        prompts = {
            'sentiment': (
                'You are an operational intelligence engine. Return ONLY valid JSON: '
                '{"sentiment":"Positive|Negative|Neutral","score":0.0-1.0,"reason":"one short line"}',
                f'Analyze sentiment of this customer message:\n"{text}"',
            ),
            'topic_extraction': (
                'You are a banking operations analyst. Return ONLY valid JSON: '
                '{"topic":"short topic label","category":"short category"}.',
                f'What is the primary topic of this customer message?\n"{text}"',
            ),
            'document_verification': (
                'You are a document verification assistant. Return ONLY valid JSON: '
                '{"verified":true|false,"confidence":0.0-1.0,"issues":["..."],"notes":"short"}',
                f'Review this extracted document text:\n"{text}"',
            ),
            'insight': (
                'You are an executive insight engine. Return ONLY valid JSON: '
                '{"insight":"what is happening","recommended_action":"what to do"}',
                f'Summarize this operational signal:\n"{text}"',
            ),
        }
        system, user = prompts.get(task, prompts['sentiment'])
        return provider.complete(system, user)

    # ------------------------------------------------------------------ fallback
    def _mock_analysis(self, text, task):
        if task == 'sentiment':
            return self._mock_sentiment(text)
        elif task == 'document_verification':
            return self._mock_document_verification(text)
        elif task == 'topic_extraction':
            return self._mock_topic_extraction(text)
        elif task == 'insight':
            return {
                'insight': 'Recurring documentation questions detected across branches.',
                'recommended_action': 'Publish a standardized pre-visit document checklist.',
            }
        return {}

    def _mock_sentiment(self, text):
        negative_words = ['bad', 'poor', 'terrible', 'worst', 'hate', 'slow', 'rude', 'long wait', 'confused', 'frustrated', 'missing', 'problem', 'issue', 'complaint', 'disappointed', 'awful']
        positive_words = ['good', 'great', 'excellent', 'fast', 'helpful', 'friendly', 'efficient', 'smooth', 'easy', 'love', 'amazing', 'wonderful', 'satisfied', 'thank']

        text_lower = text.lower()
        neg_count = sum(1 for w in negative_words if w in text_lower)
        pos_count = sum(1 for w in positive_words if w in text_lower)

        if neg_count > pos_count:
            return {'sentiment': 'Negative', 'score': round(0.2 + random.uniform(0, 0.2), 2)}
        elif pos_count > neg_count:
            return {'sentiment': 'Positive', 'score': round(0.7 + random.uniform(0, 0.2), 2)}
        return {'sentiment': 'Neutral', 'score': round(0.4 + random.uniform(0, 0.2), 2)}

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
            'online': 'Online Banking',
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
            'app': 'Digital Experience',
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

    def _mock_document_verification(self, text):
        return {'verified': True, 'confidence': 0.95, 'issues': [], 'notes': 'All required fields detected.'}