import { isThereAnyAddressOptions } from './whatsapp-chargegpt-middleware.service';

describe('isThereAnyAddressOptions', () => {
  it('should return true for text that has address options', async () => {
    const text =
      'Which of the following locations best fit your request: 1.) Kentucky Fried Chicken, Rhein Ruhr Zentrum, Humboldtring 13, 45472 Mülheim an der Ruhr, Germany, 2.) Kentucky Fried Chicken, Grothusstraße 23, 45881 Gelsenkirchen, Germany, or 3.) Kentucky Fried Chicken, Bottroper Str. 130, 45356 Essen, Germany?';

    const result = isThereAnyAddressOptions(text);
    expect(result).toBeTruthy();
  });

  it('should return false for text that does not has address options', async () => {
    const text = 'hi';

    const result = isThereAnyAddressOptions(text);
    expect(result).toBeFalsy();
  });

  it('should return false for text that has number in text', async () => {
    const text = 'str 7.';

    const result = isThereAnyAddressOptions(text);
    expect(result).toBeFalsy();
  });
});
