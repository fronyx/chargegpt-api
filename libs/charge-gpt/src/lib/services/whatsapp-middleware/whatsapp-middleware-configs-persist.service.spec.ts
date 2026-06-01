import { getPhoneToProjectMapConfig } from './whatsapp-middleware-configs-persist.service';

describe('getPhoneToProjectMapConfig', () => {
  it('should return the phone to project map config', async () => {
    // Arrange
    const sender = '+491607644803';
    const mapConfig = await getPhoneToProjectMapConfig(sender);
    expect(mapConfig).toBeTruthy();
  });
});
