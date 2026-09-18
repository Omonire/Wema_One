/**
 * Puter.js AI Service - Frontend fallback for AI functionality
 * 
 * This service provides AI capabilities using Puter.js when:
 * - Backend AI is not configured (no GROQ/GEMINI API keys)
 * - User wants to use Puter.js directly from the frontend
 * - Backend is unavailable
 * 
 * Puter.js provides free AI access without API keys.
 * Docs: https://docs.puter.com/AI/chat
 */

const PUTER_AI = {
  isAvailable: () => typeof puter !== 'undefined' && puter.ai,

  async chat(prompt, options = {}) {
    if (!this.isAvailable()) {
      throw new Error('Puter.js AI not available. Ensure puter.js is loaded.');
    }

    const defaultOptions = {
      model: options.model || 'gpt-4o-mini',
      temperature: options.temperature || 0.7,
      max_tokens: options.max_tokens || 1000,
    };

    try {
      const response = await puter.ai.chat(prompt, {
        ...defaultOptions,
        ...options,
      });
      return response;
    } catch (error) {
      console.error('Puter.js AI chat error:', error);
      throw error;
    }
  },

  async analyzeSentiment(text) {
    const prompt = `Analyze the sentiment of this customer message and return ONLY valid JSON:
    {"sentiment":"Positive|Negative|Neutral","score":0.0-1.0,"reason":"one short line"}
    
    Message: "${text}"`;

    const response = await this.chat(prompt, { temperature: 0.3 });
    return this._parseJSON(response);
  },

  async extractTopic(text) {
    const prompt = `Extract the primary topic from this customer message and return ONLY valid JSON:
    {"topic":"short topic label","category":"short category"}
    
    Message: "${text}"`;

    const response = await this.chat(prompt, { temperature: 0.3 });
    return this._parseJSON(response);
  },

  async generateInsight(text) {
    const prompt = `Analyze this operational data and provide an insight with recommended action.
    Return ONLY valid JSON:
    {"insight":"what is happening","recommended_action":"what to do"}
    
    Data: "${text}"`;

    const response = await this.chat(prompt, { temperature: 0.3 });
    return this._parseJSON(response);
  },

  async verifyDocument(text) {
    const prompt = `Review this extracted document text and verify its authenticity.
    Return ONLY valid JSON:
    {"verified":true|false,"confidence":0.0-1.0,"issues":["..."],"notes":"short"}
    
    Document text: "${text}"`;

    const response = await this.chat(prompt, { temperature: 0.3 });
    return this._parseJSON(response);
  },

  _parseJSON(response) {
    try {
      let text = typeof response === 'string' ? response : response?.message?.content || response?.text || '';
      
      if (text.startsWith('```')) {
        text = text.replace(/^```json?\n?/, '').replace(/\n?```$/, '');
      }

      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      
      if (start !== -1 && end !== -1 && end > start) {
        return JSON.parse(text.substring(start, end + 1));
      }
      
      return { raw: text };
    } catch (error) {
      console.error('Failed to parse Puter.js AI response:', error);
      return { raw: response, error: error.message };
    }
  }
};

export default PUTER_AI;
