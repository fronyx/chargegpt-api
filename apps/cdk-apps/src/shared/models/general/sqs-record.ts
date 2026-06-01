export interface ISQSRecord {
  messageId: string;
  receiptHandle: string;
  body: string;
  attributes: {
    SentTimestamp: string;
  };
}
