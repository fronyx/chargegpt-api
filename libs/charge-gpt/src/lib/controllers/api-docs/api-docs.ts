import {
  ConversationRequestPayloadDto,
  ContextUpdateRequestPayloadDto,
} from '../../models/conversation-dto';
import { getSchemaPath } from '@nestjs/swagger';
import { StartConversationResponseDto } from '../../models/start-conversation-dto';
import { UploadUrlResponseDto } from '../../models/upload-url-dto';
import { SpeechToTextResponseDto } from '../../models/speech-to-text-dto';
import {
  FiltersAnswerDto,
  RecommendationsAnswerDto,
} from '../../models/conversation-response-dto';

export const startConversationDocs = {
  deprecated: true,
  operation: {
    summary: 'Start the conversation by getting the conversation ID.',
  },
  apiQuery: {
    language: {
      name: 'language',
      required: true,
      description: 'The language that you want to set in the conversation.',
      schema: { type: 'string' },
      example: 'en',
    },
    currentTimestamp: {
      name: 'currentTimestamp',
      required: true,
      description: 'Current UNIX timestamp in milliseconds',
      schema: { type: 'integer' },
      example: 1685694555488,
    },
    timezoneOffset: {
      name: 'timezoneOffset',
      required: false,
      description:
        'Current timezone offset from UTC in minutes (eg Javascript: new Date().getTimezoneOffset())',
      schema: { type: 'integer' },
      example: -120,
    },
  },
  response: {
    200: {
      status: 200,
      schema: {
        $ref: getSchemaPath(StartConversationResponseDto),
      },
    },
    400: {
      status: 400,
      description:
        '<li>Missing required query parameter(s): language.</li>' +
        '<ul>language is either empty strings, undefined, null, or not provided in the URL. Accepted value: en | de | es | fr | pt.</ul>',
    },
    401: {
      status: 401,
      description:
        '<li>Unauthorized: Invalid API token. Please contact support@example.com for more information.' +
        '<ul>Unauthorized API token to access this endpoint.</ul>',
    },
    403: {
      status: 403,
      description:
        '<li>Missing permission(s) to the following feature(s): {providedLanguage} language. Please contact support@example.com for more information.</li>' +
        '<ul>Language provided is not valid within the project.</ul>',
    },
  },
};

export const uploadUrlDocs = {
  operation: { summary: 'Get a pre-signed URL to upload recorded audio' },
  apiQuery: {
    conversationId: {
      name: 'conversationId',
      required: true,
      description: 'Conversation ID that returns from start endpoint',
      schema: { type: 'string' },
      example: '2518c990-e732-4786-aa1f-1c2d1619aa49',
    },
  },
  response: {
    200: {
      status: 200,
      schema: {
        $ref: getSchemaPath(UploadUrlResponseDto),
      },
    },
    401: {
      status: 401,
      description:
        '<li>Unauthorized: Invalid API token. Please contact support@example.com for more information.' +
        '<ul>Unauthorized API token to access this endpoint.</ul>',
    },
  },
};

export const convertSpeechToTextDocs = {
  operation: { summary: 'Convert speech to text' },
  apiQuery: {
    conversationId: {
      name: 'conversationId',
      required: true,
      description: 'Conversation ID that returns from start endpoint.',
      schema: { type: 'string' },
      example: '2518c990-e732-4786-aa1f-1c2d1619aa49',
    },
    fileId: {
      name: 'fileId',
      required: true,
      description:
        'A file ID of your uploaded audio that returns from upload-url endpoint.',
      schema: { type: 'string' },
      example: '577f35dd-86a1-4992-ac55-5bc5e249a521',
    },
    audioFormat: {
      name: 'audioFormat',
      required: false,
      description: 'Format of audio file that you uploaded to S3 buckets.',
      schema: { type: 'string' },
      example: 'wav',
    },
  },
  response: {
    200: {
      status: 200,
      schema: {
        $ref: getSchemaPath(SpeechToTextResponseDto),
      },
    },
    400: {
      status: 400,
      description:
        '<li>Missing required query parameter(s): fileId.</li>' +
        '<ul>File ID is either empty strings, undefined, null, or not provided in the URL</ul>' +
        '<li>Unsupported media length. Submitted value: {audioDuration}s. Accepted value: <60s.</li>' +
        '<ul>An audio should to be less than 60 seconds.</ul>',
    },
    401: {
      status: 401,
      description:
        '<li>Unauthorized: Invalid API token. Please contact support@example.com for more information.' +
        '<ul>Unauthorized API token to access this endpoint.</ul>',
    },
    403: {
      status: 403,
      description:
        // eslint-disable-next-line quotes
        "<li>Missing permission(s) to the following feature(s): User don't have access to the voice feature. Please contact support@example.com for more information.</li>" +
        '<ul>Invalid query parameter. User only has access to text feature.</ul>',
    },
    415: {
      status: 415,
      description:
        '<li>Unsupported media type. Submitted type: {audioFormat}. Accepted type(s): mp3, mp4, mpeg, mpga, m4a, wav and webm.</li>' +
        '<ul>Unsupported audio format</ul>' +
        '<li>Unsupported media: volume too low. Submitted volume: {meanVolume} dB. Accepted volume: > -37 dB.</li>' +
        '<ul>An audio must have decibel value more than -37</ul>' +
        '<li>Unsupported media: Audio too big. Accepted maximum file size 20MB.</li>' +
        '<ul>Unsupported file size. Please upload smaller audio sizes.</ul>',
    },
  },
};

export const recommendationsDocs = {
  operation: {
    summary:
      'Accept text request and provide response in terms of question or recommendations accordingly',
  },
  apiQuery: {
    conversationId: {
      name: 'conversationId',
      required: true,
      description: 'Conversation ID obtained from "GET /conversation" endpoint',
      schema: { type: 'string' },
      example: '2518c990-e732-4786-aa1f-1c2d1619aa49',
    },
  },
  body: {
    description: 'Conversation payload',
    schema: {
      $ref: getSchemaPath(ConversationRequestPayloadDto),
    },
  },
  response: {
    201: {
      status: 201,
      schema: {
        $ref: getSchemaPath(RecommendationsAnswerDto),
      },
    },
    400: {
      status: 400,
      description:
        '<li>Unsupported value(s) for properties in the request body: currentCoordinates. Accepted value(s): latitude [-90, 90], longitude [-180, 180].</li>' +
        '<ul>Latitude and longitude is invalid.</ul>' +
        // eslint-disable-next-line quotes
        "<li>Unsupported value(s) for properties in the request body: deniedContext. Accepted value(s): 'Location'</li>" +
        '<ul>Denied context is invalid.</ul>',
    },
    401: {
      status: 401,
      description:
        '<li>Unauthorized: Invalid API token. Please contact support@example.com for more information.' +
        '<ul>Unauthorized API token to access this endpoint.</ul>',
    },
    403: {
      status: 403,
      description:
        '<li>Missing permission(s) to the following feature(s): Invalid API token. Please contact support@example.com for more information.</li>' +
        '<ul>Missing permission to access recommendation features.</ul>',
    },
  },
};

export const filtersDocs = {
  operation: {
    summary:
      'Accept text request and provide response in terms of question or filters accordingly',
  },
  apiQuery: {
    conversationId: {
      name: 'conversationId',
      required: true,
      description: 'Conversation ID that returns from start endpoint',
      schema: { type: 'string' },
      example: '2518c990-e732-4786-aa1f-1c2d1619aa49',
    },
  },
  body: {
    description: 'Conversation payload',
    schema: {
      $ref: getSchemaPath(ConversationRequestPayloadDto),
    },
  },
  response: {
    201: {
      status: 201,
      schema: {
        $ref: getSchemaPath(FiltersAnswerDto),
      },
    },
    400: {
      status: 400,
      description:
        '<li>Unsupported value(s) for properties in the request body: currentCoordinates. Accepted value(s): latitude [-90, 90], longitude [-180, 180].</li>' +
        '<ul>Latitude and longitude is invalid.</ul>' +
        // eslint-disable-next-line quotes
        "<li>Unsupported value(s) for properties in the request body: deniedContext. Accepted value(s): 'Location'</li>" +
        '<ul>Denied context is invalid.</ul>',
    },
    401: {
      status: 401,
      description:
        '<li>Unauthorized: Invalid API token. Please contact support@example.com for more information.' +
        '<ul>Unauthorized API token to access this endpoint.</ul>',
    },
    403: {
      status: 403,
      description:
        '<li>Missing permission(s) to the following feature(s): Invalid API token. Please contact support@example.com for more information.</li>' +
        '<ul>Missing permission to access filter features.</ul>',
    },
  },
};

export const feedbackDocs = {
  operation: { summary: 'Submit feedback' },
  apiQuery: {
    conversationId: {
      name: 'conversationId',
      required: true,
      description: 'Conversation ID that returns from start endpoint.',
      schema: { type: 'string' },
      example: '2518c990-e732-4786-aa1f-1c2d1619aa49',
    },
  },
  response: {
    204: {
      status: 204,
      description: 'Feedback received',
    },
    400: {
      status: 400,
      description:
        // eslint-disable-next-line quotes
        "<li>Missing required properties in the request body: rating. Accepted value(s): ['+1', '-1'].</li>" +
        '<ul>Rating is either empty strings, undefined or null,</ul>',
    },
    401: {
      status: 401,
      description:
        '<li>Unauthorized: Invalid API token. Please contact support@example.com for more information.' +
        '<ul>Unauthorized API token to access this endpoint.</ul>',
    },
  },
};

export const updateContextDocs = {
  operation: { summary: 'Update context' },
  apiQuery: {
    conversationId: {
      name: 'conversationId',
      required: true,
      description: 'Conversation ID that returns from start endpoint',
      schema: { type: 'string' },
      example: '2518c990-e732-4786-aa1f-1c2d1619aa49',
    },
  },
  body: {
    description: 'Update context',
    schema: {
      $ref: getSchemaPath(ContextUpdateRequestPayloadDto),
    },
  },
  response: {
    204: {
      status: 204,
      description: 'Context was updated',
    },
    400: {
      status: 400,
      description:
        '<li>Unsupported value(s) for properties in the request body: activity. Accepted value(s): chargegpt_filters_user_action:filters_updated, chargegpt_filters_user_action:array_value_removed, chargegpt_filters_user_action:boolean_value_removed, chargegpt_filters_user_action:integer_value_removed, chargegpt_filters_user_action:array_value_added, chargegpt_filters_user_action:boolean_value_added, chargegpt_filters_user_action:integer_value_added</li>' +
        '<ul>Activity property is invalid. Please refer to accepted value(s).</ul>' +
        '<li>Unsupported properties in the request body. Accepted properties: min_power, max_power, power_enabled...</li>' +
        '<ul>Filter properties are invalid. Please contact support@example.com for more information</ul>',
    },
    401: {
      status: 401,
      description:
        '<li>Unauthorized: Invalid API token. Please contact support@example.com for more information.' +
        '<ul>Unauthorized API token to access this endpoint.</ul>',
    },
  },
};

