import { removeUnwantedLocationsBasedOnTypes } from './address-filter-utils.service';

const locations = [
  {
    description: 'McDonald\'s, Karnaper Straße, Essen, Germany',
    matched_substrings: [
      {
        length: 10,
        offset: 0,
      },
      {
        length: 5,
        offset: 29,
      },
    ],
    place_id: 'ChIJw2AIXf7puEcRYJ1XUktyzc4',
    reference: 'ChIJw2AIXf7puEcRYJ1XUktyzc4',
    structured_formatting: {
      main_text: 'McDonald\'s',
      main_text_matched_substrings: [
        {
          length: 10,
          offset: 0,
        },
      ],
      secondary_text: 'Karnaper Straße, Essen, Germany',
      secondary_text_matched_substrings: [
        {
          length: 5,
          offset: 17,
        },
      ],
    },
    terms: [
      {
        offset: 0,
        value: 'McDonald\'s',
      },
      {
        offset: 12,
        value: 'Karnaper Straße',
      },
      {
        offset: 29,
        value: 'Essen',
      },
    ],
    types: ['establishment', 'food', 'point_of_interest', 'restaurant'],
    countryCode: 'deu',
  },
  {
    description: 'McDonald\'s, Am Hauptbahnhof, Essen, Germany',
    matched_substrings: [
      {
        length: 10,
        offset: 0,
      },
      {
        length: 5,
        offset: 29,
      },
    ],
    place_id: 'ChIJbcMMo7bCuEcRfH_swpkou60',
    reference: 'ChIJbcMMo7bCuEcRfH_swpkou60',
    structured_formatting: {
      main_text: 'McDonald\'s',
      main_text_matched_substrings: [
        {
          length: 10,
          offset: 0,
        },
      ],
      secondary_text: 'Am Hauptbahnhof, Essen, Germany',
      secondary_text_matched_substrings: [
        {
          length: 5,
          offset: 17,
        },
      ],
    },
    terms: [
      {
        offset: 0,
        value: 'McDonald\'s',
      },
      {
        offset: 12,
        value: 'Am Hauptbahnhof',
      },
      {
        offset: 29,
        value: 'Essen',
      },
    ],
    types: ['restaurant', 'point_of_interest', 'food', 'establishment'],
    countryCode: 'deu',
  },
  {
    description: 'McDonald\'s, Ruhrbruchshof, Essen, Germany',
    matched_substrings: [
      {
        length: 10,
        offset: 0,
      },
      {
        length: 5,
        offset: 27,
      },
    ],
    place_id: 'ChIJu6LuL6PduEcRWPki7EeJNxc',
    reference: 'ChIJu6LuL6PduEcRWPki7EeJNxc',
    structured_formatting: {
      main_text: 'McDonald\'s',
      main_text_matched_substrings: [
        {
          length: 10,
          offset: 0,
        },
      ],
      secondary_text: 'Ruhrbruchshof, Essen, Germany',
      secondary_text_matched_substrings: [
        {
          length: 5,
          offset: 15,
        },
      ],
    },
    terms: [
      {
        offset: 0,
        value: 'McDonald\'s',
      },
      {
        offset: 12,
        value: 'Ruhrbruchshof',
      },
      {
        offset: 27,
        value: 'Essen',
      },
    ],
    types: ['establishment', 'food', 'point_of_interest', 'restaurant'],
    countryCode: 'deu',
  },
  {
    description: 'McDonald\'s, Eleonorastraße, Essen, Germany',
    matched_substrings: [
      {
        length: 10,
        offset: 0,
      },
      {
        length: 5,
        offset: 28,
      },
    ],
    place_id: 'ChIJLYj8uS7duEcROpVp23jLFoQ',
    reference: 'ChIJLYj8uS7duEcROpVp23jLFoQ',
    structured_formatting: {
      main_text: 'McDonald\'s',
      main_text_matched_substrings: [
        {
          length: 10,
          offset: 0,
        },
      ],
      secondary_text: 'Eleonorastraße, Essen, Germany',
      secondary_text_matched_substrings: [
        {
          length: 5,
          offset: 16,
        },
      ],
    },
    terms: [
      {
        offset: 0,
        value: 'McDonald\'s',
      },
      {
        offset: 12,
        value: 'Eleonorastraße',
      },
      {
        offset: 28,
        value: 'Essen',
      },
    ],
    types: ['restaurant', 'point_of_interest', 'food', 'establishment'],
    countryCode: 'deu',
  },
  {
    description: 'McDonald\'s, Limbecker Platz, Essen, Germany',
    matched_substrings: [
      {
        length: 10,
        offset: 0,
      },
      {
        length: 5,
        offset: 29,
      },
    ],
    place_id: 'ChIJ54wMVLjCuEcRhQYCOBnRGFc',
    reference: 'ChIJ54wMVLjCuEcRhQYCOBnRGFc',
    structured_formatting: {
      main_text: 'McDonald\'s',
      main_text_matched_substrings: [
        {
          length: 10,
          offset: 0,
        },
      ],
      secondary_text: 'Limbecker Platz, Essen, Germany',
      secondary_text_matched_substrings: [
        {
          length: 5,
          offset: 17,
        },
      ],
    },
    terms: [
      {
        offset: 0,
        value: 'McDonald\'s',
      },
      {
        offset: 12,
        value: 'Limbecker Platz',
      },
      {
        offset: 29,
        value: 'Essen',
      },
    ],
    types: ['establishment', 'food', 'point_of_interest', 'restaurant', 'something else'],
    countryCode: 'deu',
  },
];

describe('removeUnwantedLocationsBasedOnTypes', () => {
  it('should remove unwanted locations based on types', () => {
    const wantedLocations = removeUnwantedLocationsBasedOnTypes(locations);
    expect(wantedLocations.length).toBe(4);
  });
});