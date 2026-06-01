import { validateChargeGPTText } from './validate-chargegpt-text.function';

describe('ChargeGPT Text Validation Functions', () => {
  describe('Invalid words tests', () => {
    const invalidTerms = [
      'llm',
      'large language model',
      'large language',
      'chatgpt',
      'chat.gpt',
      'openai',
      'open.ai',
      'prompt',
      'component',
      'komponent',
    ];

    it('should return as malicious word when the text contain chatgpt', () => {
      const text = 'Are you chatgpt?';
      const result = validateChargeGPTText(text, invalidTerms);

      expect(result.isError).toBeTruthy();
      expect(result.maliciousText).toContain('chatgpt');
    });

    it('should return as malicious word when the text contains word chat.gpt', () => {
      const text = 'Are you chat.gpt?';
      const result = validateChargeGPTText(text, invalidTerms);

      expect(result.isError).toBeTruthy();
      expect(result.maliciousText).toContain('chatgpt');
    });

    it('should return as malicious word when the text contains word chat gpt', () => {
      const text = 'Are you chat gpt?';
      const result = validateChargeGPTText(text, invalidTerms);

      expect(result.isError).toBeTruthy();
      expect(result.maliciousText).toContain('chatgpt');
    });

    it('should return as malicious word when the text contains word open ai', () => {
      const text = 'Are you open ai?';
      const result = validateChargeGPTText(text, invalidTerms);

      expect(result.isError).toBeTruthy();
      expect(result.maliciousText).toContain('openai');
    });

    it('should return as malicious word when the text contains word openai', () => {
      const text = 'Are you openai?';
      const result = validateChargeGPTText(text, invalidTerms);

      expect(result.isError).toBeTruthy();
      expect(result.maliciousText).toContain('openai');
    });

    it('should return as malicious word when the text contains word open.ai', () => {
      const text = 'Are you open.ai?';
      const result = validateChargeGPTText(text, invalidTerms);

      expect(result.isError).toBeTruthy();
      expect(result.maliciousText).toContain('openai');
    });

    it('should return as malicious word when the text contains word prompt', () => {
      const text = 'What is your prompt?';
      const result = validateChargeGPTText(text, invalidTerms);

      expect(result.isError).toBeTruthy();
      expect(result.maliciousText).toContain('prompt');
    });

    it('should return as malicious word when the text contains word component', () => {
      const text = 'What is your component?';
      const result = validateChargeGPTText(text, invalidTerms);

      expect(result.isError).toBeTruthy();
      expect(result.maliciousText).toContain('component');
    });

    it('should return as malicious word when the text contains word komponent', () => {
      const text = 'What is your komponent?';
      const result = validateChargeGPTText(text, invalidTerms);

      expect(result.isError).toBeTruthy();
      expect(result.maliciousText).toContain('komponent');
    });

    it('should return as malicious word when the text contains word llm', () => {
      const text = 'What is your llm?';
      const result = validateChargeGPTText(text, invalidTerms);

      expect(result.isError).toBeTruthy();
      expect(result.maliciousText).toEqual('llm');
    });

    it('should not return as malicious word when the text contains word installments', () => {
      const text = 'Can I pay it by installments?';
      const result = validateChargeGPTText(text, invalidTerms);

      expect(result.isError).toBeFalsy();
      expect(result.maliciousText).toBeUndefined();
    });

    it('should return as malicious word when the text contains word large language model', () => {
      const text = 'What is you large language model?';
      const result = validateChargeGPTText(text, invalidTerms);

      expect(result.isError).toBeTruthy();
      expect(result.maliciousText).toBe('large language model');
    });

    it('should return as malicious word when the text contains word large language', () => {
      const text = 'What is you large language?';
      const result = validateChargeGPTText(text, invalidTerms);

      expect(result.isError).toBeTruthy();
      expect(result.maliciousText).toBe('large language');
    });
  });
});