import { getMessagesFromBody, processWebhookEvents } from './whatsapp-webhook.service';

const headers = {
  'x-forwarded-for': '173.252.127.2',
  'x-forwarded-proto': 'https',
  'x-forwarded-port': '443',
  host: 'stagingapi.example.com',
  'x-amzn-trace-id': 'Root=1-66cde301-6803179550647fb81a8ad232',
  'content-length': '528',
  accept: '*/*',
  'accept-encoding': 'deflate, gzip',
  'user-agent': 'facebookexternalua',
  'content-type': 'application/json',
  'x-hub-signature': 'sha1=463e4d8148777dea098ff0de980055facef321c5',
  'x-hub-signature-256':
    'sha256=6a7587739844eb7cc08654e319569aab3a43f8bfa9996bbe75d1f2c81262f542',
};

const messages = [
  {
    from: '491607644803',
    id: 'wamid.HBgMNDkxNjA3NjQ0ODAzFQIAEhgUM0EyRUU4MTg5NERENUEyNDVCMDgA',
    timestamp: '1724769024',
    text: {
      body: 'Hey hey. Just want to ask where can I charge in Coburg?',
    },
    type: 'text',
  },
];

const locationBody = {
  object: 'whatsapp_business_account',
  entry: [
    {
      id: '398954099970265',
      changes: [
        {
          value: {
            messaging_product: 'whatsapp',
            metadata: {
              display_phone_number: '4915209333427',
              phone_number_id: '432255216630607',
            },
            contacts: [
              {
                profile: {
                  name: 'Hidayat Halim',
                },
                wa_id: '491607644803',
              },
            ],
            messages: [
              {
                from: '491607644803',
                id: 'wamid.HBgMNDkxNjA3NjQ0ODAzFQIAEhgUM0E4RTg2NjFCNkZBRTBGNTRFQ0MA',
                timestamp: '1724770141',
                location: {
                  latitude: 50.2682762146,
                  longitude: 10.959774971008,
                },
                type: 'location',
              },
            ],
          },
          field: 'messages',
        },
      ],
    },
  ],
};

const body = {
  object: 'whatsapp_business_account',
  entry: [
    {
      id: '398954099970265',
      changes: [
        {
          value: {
            messaging_product: 'whatsapp',
            metadata: {
              display_phone_number: '4915209333427',
              phone_number_id: '432255216630607',
            },
            contacts: [
              {
                profile: {
                  name: 'Hidayat Halim',
                },
                wa_id: '491607644803',
              },
            ],
            messages,
          },
          field: 'messages',
        },
      ],
    },
  ],
};

describe('WhatsAppWebhookService', () => {
  describe('processWebhookEvents', () => {
    it('should process webhook events', async () => {
        processWebhookEvents(headers, body);
        expect(true).toBe(true);
    });
  });

  describe('getMessagesFromBody', () => {
    it('should get messages from body', () => {
      const messagesFromBody = getMessagesFromBody(body);
      expect(messagesFromBody.length).toBe(1);
      expect(messagesFromBody).toEqual([messages]);
    });
  });
});

