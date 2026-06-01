import { cleanRawString, parseChatGPTJSON } from './parse-chatgpt-json.utils';

describe('parseChatGptJson', () => {
  it('should parse ChatGPT output string into JSON', () => {
    const rawResponse =
      '```json\n{\n"message": "Wo und wann möchtest du laden?",\n"outOfScope": false\n}\n```';
    const parsedResponse = parseChatGPTJSON(rawResponse);
    const expectedResponse = JSON.parse('{"message": "Wo und wann möchtest du laden?","outOfScope": false}');
    expect(parsedResponse).toEqual(expectedResponse);
  });
});

describe('cleanRawString', () => {
  it('should prepare the string for JSON.parse', () => {
    const rawResponse =
      '```json\n{\n"message": "Wo und wann möchtest du laden?",\n"outOfScope": false\n}\n```';
    const cleanedResponse = cleanRawString(rawResponse);
    const expectedResponse = '{"message": "Wo und wann möchtest du laden?","outOfScope": false}';
    expect(cleanedResponse).toEqual(expectedResponse);
  });
})
