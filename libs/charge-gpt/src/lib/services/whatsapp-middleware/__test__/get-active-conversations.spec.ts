describe('getActiveConversation', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  describe('when there no conversation record', () => {
    it('should return new active conversation', async () => {
      const conversationId = 'foo_id';
      const initializeNewConversationMock = jest.fn(() => {
        return Promise.resolve({
          id: conversationId,
          getUpdatedAt: () => new Date(),
        });
      });
      const getRecordMock = jest
        .fn()
        .mockImplementation(() => Promise.resolve(null));
      const saveRecordMock = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      const storeConversationHistoryMock = jest
        .fn()
        .mockImplementation(() => Promise.resolve());

      jest.mock('../conversation-persist.service', () => ({
        storeConversationHistory: storeConversationHistoryMock,
      }));

      jest.mock('../whatsapp-record-persist.service', () => ({
        ...(jest.requireActual('../whatsapp-record-persist.service') as any),
        saveRecord: saveRecordMock,
        getRecord: getRecordMock,
      }));

      const recipient = '1234';
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const WhatsAppMiddleware = require('../whatsapp-chargegpt-middleware.service');
      jest
        .spyOn(WhatsAppMiddleware, 'initializeNewConversation')
        .mockImplementation(initializeNewConversationMock);
      const conversation = await WhatsAppMiddleware.getActiveConversation(
        recipient
      );
      expect(conversation.id).toBe(conversationId);
      expect(saveRecordMock).toBeCalledTimes(1);
      const expectedRecord = {
        id: recipient,
        partitionKey: `staging:${recipient}`,
        conversationIds: [conversationId],
        activeConversationId: conversationId,
        updatedAt: expect.any(Number),
      };
      expect(saveRecordMock).toHaveBeenCalledWith(expectedRecord);
      expect(storeConversationHistoryMock).toBeCalledTimes(1);
      expect(storeConversationHistoryMock).toHaveBeenCalledWith(conversation);
    });
  });

  describe('when there is an outdated conversation record', () => {
    it('should start a new conversation', async () => {
      const conversationId = 'foo_id';
      const outdatedDate = new Date();
      const recipient = '1234';
      outdatedDate.setMinutes(outdatedDate.getMinutes() - 20);
      const recordMock = {
        id: recipient,
        activeConversationId: conversationId,
        partitionKey: `staging:${recipient}`,
        conversationIds: [conversationId],
        updatedAt: outdatedDate.getTime(),
      };
      const getRecordMock = jest
        .fn()
        .mockImplementation(() => Promise.resolve(recordMock));
      const saveRecordMock = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      const storeConversationHistoryMock = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      const getConversationHistoryDataMock = jest.fn().mockImplementation(() =>
        Promise.resolve({
          id: conversationId,
          updatedAt: outdatedDate,
        })
      );
      jest.mock('../conversation-persist.service', () => ({
        storeConversationHistory: storeConversationHistoryMock,
        getConversationHistoryData: getConversationHistoryDataMock,
      }));

      jest.mock('../whatsapp-record-persist.service', () => ({
        ...(jest.requireActual('../whatsapp-record-persist.service') as any),
        saveRecord: saveRecordMock,
        getRecord: getRecordMock,
      }));

      const newConversationId = 'foo_id_2';
      const initializeNewConversationMock = jest.fn(() => {
        return Promise.resolve({
          id: newConversationId,
          getUpdatedAt: () => new Date(),
        });
      });
      const informNewConversationStartedFnMock = jest.fn();

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const WhatsAppMiddleware = require('../whatsapp-chargegpt-middleware.service');
      jest
        .spyOn(WhatsAppMiddleware, 'initializeNewConversation')
        .mockImplementation(initializeNewConversationMock);

      const conversation = await WhatsAppMiddleware.getActiveConversation(
        recipient,
        informNewConversationStartedFnMock
      );

      expect(conversation.id).toBe(newConversationId);
      expect(saveRecordMock).toBeCalledTimes(1);
      const expectedRecord = {
        id: recipient,
        partitionKey: `staging:${recipient}`,
        conversationIds: [conversationId, newConversationId],
        activeConversationId: newConversationId,
        updatedAt: expect.any(Number),
      };
      expect(saveRecordMock).toHaveBeenCalledWith(expectedRecord);
      expect(storeConversationHistoryMock).toBeCalledTimes(1);
      expect(storeConversationHistoryMock).toHaveBeenCalledWith(conversation);
      expect(informNewConversationStartedFnMock).toHaveBeenCalledWith(
        recipient
      );
      expect(informNewConversationStartedFnMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('when there is a valid conversation', () => {
    it('should return existing conversation', async () => {
      const conversationId = 'foo_id';
      const notInvalidDate = new Date();
      const recipient = '1234';
      notInvalidDate.setMinutes(notInvalidDate.getMinutes() - 10);
      const recordMock = {
        id: recipient,
        activeConversationId: conversationId,
        partitionKey: `staging:${recipient}`,
        conversationIds: [conversationId],
        updatedAt: notInvalidDate.getTime(),
      };
      const getRecordMock = jest
        .fn()
        .mockImplementation(() => Promise.resolve(recordMock));
      const saveRecordMock = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      const storeConversationHistoryMock = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      const getConversationHistoryDataMock = jest.fn().mockImplementation(() =>
        Promise.resolve({
          id: conversationId,
          updatedAt: notInvalidDate,
        })
      );
      jest.mock('../conversation-persist.service', () => ({
        storeConversationHistory: storeConversationHistoryMock,
        getConversationHistoryData: getConversationHistoryDataMock,
      }));

      jest.mock('../whatsapp-record-persist.service', () => ({
        ...(jest.requireActual('../whatsapp-record-persist.service') as any),
        saveRecord: saveRecordMock,
        getRecord: getRecordMock,
      }));

      const initializeNewConversationMock = jest.fn();
      const informNewConversationStartedFnMock = jest.fn();

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const WhatsAppMiddleware = require('../whatsapp-chargegpt-middleware.service');

      jest
        .spyOn(WhatsAppMiddleware, 'initializeNewConversation')
        .mockImplementation(initializeNewConversationMock);

      const conversation = await WhatsAppMiddleware.getActiveConversation(
        recipient,
        informNewConversationStartedFnMock
      );

      expect(conversation.id).toBe(conversationId);
      expect(saveRecordMock).not.toHaveBeenCalled();
      expect(storeConversationHistoryMock).not.toHaveBeenCalled();
      expect(informNewConversationStartedFnMock).not.toHaveBeenCalled();
    });
  });
});
