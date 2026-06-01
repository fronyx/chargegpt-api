import { queryFallback } from './query-utils.service';

describe('Query utils', () => {
  describe('queryFallback', () => {
    it('should go to the next query if the first one fails', async () => {
      const query1 = jest
        .fn()
        .mockResolvedValue({ status: 400, data: { status: 'NOT_OK' } });
      const query2 = jest.fn().mockResolvedValue({
        status: 200,
        data: { status: 'OK', candidates: [{ id: 2 }] },
      });
      const result = await queryFallback(query1, query2);

      expect(query1).toHaveBeenCalled();
      expect(query2).toHaveBeenCalled();
      expect(result).toEqual([{ id: 2 }]);
    });

    it('should not go to the next query if the first one succeeds', async () => {
      const query1 = jest.fn().mockResolvedValue({
        status: 200,
        data: { status: 'OK', candidates: [{ id: 1 }] },
      });
      const query2 = jest.fn().mockResolvedValue({
        status: 200,
        data: { status: 'OK', candidates: [{ id: 2 }] },
      });
      const results = await queryFallback(query1, query2);

      expect(query1).toHaveBeenCalled();
      expect(query2).not.toHaveBeenCalled();
      expect(results).toEqual([{ id: 1 }]);
    });
  });
});
