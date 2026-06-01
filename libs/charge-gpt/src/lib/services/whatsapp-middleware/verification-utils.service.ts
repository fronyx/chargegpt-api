import { configService } from '@fronyx/configurations';

export const validateVerificationRequest = (params: any): number => {
  if (!params) {
    throw new Error('Invalid verification query params');
  }

  const requiredProperties = ['hub.mode', 'hub.verify_token', 'hub.challenge'];

  if (
    requiredProperties.some(
      (val) => !Object.prototype.hasOwnProperty.call(params, val)
    )
  ) {
    throw new Error('Invalid verification query params');
  }

  if (params['hub.mode'] !== 'subscribe') {
    throw new Error('Invalid hub.mode value');
  }
  
  if (
    params['hub.verify_token'] !== configService.getWhatsappWebhookVerifyToken()
  ) {
    throw new Error('Invalid hub.verify_token value');
  }

  return parseInt(params['hub.challenge']);
};
