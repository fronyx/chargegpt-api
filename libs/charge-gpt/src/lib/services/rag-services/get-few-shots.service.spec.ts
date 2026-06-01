import { getFewShotExamples } from './get-few-shots.service';

describe('gewFewShotExamples', () => {
    it('should render the template properly', () => {
        const result = getFewShotExamples([
            {
                assistant: '{address: "{{somePlace}}"}',
                user: 'I want to charge in {{somePlace}}',
            }
        ], { somePlace: 'Berlin' });

        expect(result).toEqual([{
            assistant: '{address: "Berlin"}',
            user: 'I want to charge in Berlin',
        }]);
    });
});