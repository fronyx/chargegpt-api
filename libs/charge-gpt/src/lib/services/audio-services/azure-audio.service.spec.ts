import { textToSpeech } from './azure-audio.service';

describe('textToSpeech', () => {
  it('should synthesize text to speech', async () => {
    const text = 'Tzaziki';
    const file = await textToSpeech(text, 'en');
    expect(file).toContain('.wav');
  });
});