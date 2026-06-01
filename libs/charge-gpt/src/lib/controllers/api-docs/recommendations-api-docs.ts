import { ApiBodyOptions } from '@nestjs/swagger';

const destinationDocBody: ApiBodyOptions = {
  schema: {
    type: 'object',
    properties: {
      coordinates: {
        type: 'object',
        properties: {
          lat: {
            type: 'number',
            example: 51.436310,
          },
          lng: {
            type: 'number',
            example: 7.024340,
          }
        }
      },
      address: {
        type: 'string',
        example: 'Herner Str. 299, 44809 Bochum',
      },
      powerType: {
        type: 'string',
        enum: ['AC', 'DC'],
        example: 'DC',
      },
      timestamp: {
        type: 'integer',
        example: Date.now(),
      },
      connectorType: {
        type: 'string',
        enum: ['IEC_62196_T2', 'IEC_62196_T2_COMBO', 'CHADEMO'],
        example: 'CHADEMO',
      },
      minPower: {
        type: 'number',
        example: 22,
      },
      maxPower: {
        type: 'number',
        example: 150,
      },
    },
    required: ['timestamp', 'address'],
  }
}

export const destinationDocs: any = {
  operation: { summary: 'Retrieve the recommendations for a specific destination (THIS IS NOT A CONVERSATION ENDPOINT)' },
  body: destinationDocBody,
  response: {
    200: {
      status: 200,
      schema: {
        // TODO missing schema
        example:
          [
            {
              locationId: 'DE2GOL000430876',
              distance: 297.0193540634546,
              link: 'https://www.google.com/maps/search/?api=1&query=51.436310,7.024340',
              lat: 51.436310,
              lng: 7.024340,
              powerType: 'DC',
              probability: 0,
              powerKw: 150,
              connectorTypes: ['IEC_62196_T2_COMBO', 'CHADEMO'],
              recommendation: 'Fastest',
            },
            {
              locationId: 'DE-ALL-EGO001883',
              distance: 289.92340861519347,
              link: 'https://www.google.com/maps/search/?api=1&query=51.439657,7.023669',
              lat: 51.439657,
              lng: 7.023669,
              powerType: 'AC',
              probability: 0,
              powerKw: 22,
              connectorTypes: ['IEC_62196_T2'],
              recommendation: 'Slower option',
            },
            {
              locationId: 'DE-ISE-KP01270',
              distance: 427.7349701475311,
              link: 'https://www.google.com/maps/search/?api=1&query=51.440755,7.016849',
              lat: 51.440755,
              lng: 7.016849,
              powerType: 'AC',
              probability: 0,
              powerKw: 22,
              connectorTypes: ['IEC_62196_T2'],
              recommendation: 'Slower option'
            }
          ],
      },
    },
    403: {
      status: 403,
      description:
        '<li>Missing permission(s) to the following feature(s): Invalid API token. Please contact support@example.com for more information.</li>' +
        '<ul>API token is either not valid, undefined, null or not provided.</ul>' +
        '<li>Missing permission(s) to the following feature(s): Data access to country {countryCode}. Please contact support@example.com for more information.</li>' +
        '<ul>User does not have access to charge stations of country (country code) that you ask.</ul>',
    },
    500: {
      status: 500,
      description:
        '<li>Request for charging in the past are not possible. Please try again with a valid, current date and time or a future date and time.</li>' +
        '<ul>The request cannot be processed as the requested time is in the past.</ul>' +
        '<li>Sorry, there is an issue while attempting to locate the address or point of interest (POI) you entered. Please provide a different address or POI.</li>' +
        '<ul>Error while getting the located address or point of interest (POI).</ul>' +
        '<li>Sorry, there is an issue while attempting to locate the coordinates you entered. Please provide a different coordinates, address or POI.</li>' +
        '<ul>Error while getting the coordinates information</ul>' +
        '<li>Sorry, it appears that there are no charging stations found near the requested location. Please consider entering a different address, point of interest (POI), or coordinates in your next search.</li>' +
        '<ul>There are no charging stations found near the requested location.</ul>' +
        '<li>Sorry, there are no charging stations available near the specified location for the requested date and time. Please try again with a different date and time.</li>' +
        '<ul>There are no charging stations available near the specified location for the requested date and time.</ul>'
    }
  },
};
