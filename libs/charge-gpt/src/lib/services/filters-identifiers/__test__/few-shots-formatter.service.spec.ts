import { getConversationSummary, getIdentifiedFilters } from './few-shots-formatter.service';

describe('getConversationSummary', () => {
    it('should get correct conversation summary', () => {
        const summary = '- The user requested to charge at a slow charger.\n- The next agent presented fitting charge points.';
        const userRequest = `Conversation history: {${summary}}
        # Example description: No request for charging speed in this request
        User request: Reset all filters.
        Your response: `;

        const result = getConversationSummary(userRequest);
        expect(result).toEqual(summary);
    });
});

describe('getIdentifiedFilters', () => {
    it('should get correct identified filters', () => {
        const identifiedFilters = '{min_power: 30, max_power: 70, power_enabled: true}';
        const userRequest = `Successfully matched request parts: ${identifiedFilters}
        Conversation summary: {The user requested a fast charge point.}
      
        # Example description: "Fast charging" was matched to charging power. all is valid. return 'null'
      
        Answer in language: French
        User request: I want to charge fast.
        Your response: `;

        const result = getIdentifiedFilters(userRequest);
        expect(result).toEqual(identifiedFilters);
    });
})