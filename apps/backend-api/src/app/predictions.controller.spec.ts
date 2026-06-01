import { Test, TestingModule } from '@nestjs/testing';
import { PredictionsQueryService, EvsePredictionsService, EvsesService, LocationsService } from '@fronyx/predictions';
import { PredictionsController } from './predictions.controller';
import { AccessScopeService } from '@fronyx/authentications';
import { createMock } from '@golevelup/ts-jest';
import { OcpiLocationsService } from '@fronyx/persistence';
import { TimeframeQueryParams } from '@fronyx/data-transfer-object';
import { CacheService } from '@fronyx/cache';
import { fronyxProject } from './mocks/projects.mock';
import { CachePredictionsFactory } from './mocks/cache-predictions.factory';
import { PredictionsFactory } from './mocks/predictions.factory';
import { location } from './mocks/locations.mock';
import { ToolkitProject } from '@fronyx/toolkit';

describe('PredictionsController', () => {
  let controller: PredictionsController;
  let module: TestingModule;
  let cacheService: CacheService;
  let evsesService: EvsesService;
  let locationsService: LocationsService;
  let evsesPredictionsService: EvsePredictionsService;

  const evseId = 'someid';
  const locationId = 'locationId';
  const uid = 'uid';
  const now = Date.now();
  const id = 'someLocationId';

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [
        PredictionsController,
      ],
      providers: [
        PredictionsQueryService,
        EvsePredictionsService,
        {
          provide: OcpiLocationsService,
          useValue: createMock<OcpiLocationsService>()
        },
        {
          provide: AccessScopeService,
          useValue: createMock<AccessScopeService>()
        },
        {
          provide: EvsesService,
          useValue: createMock<EvsesService>()
        },
        {
          provide: CacheService,
          useValue: createMock<CacheService>()
        },
        {
          provide: LocationsService,
          useValue: createMock<LocationsService>()
        },
      ],
    }).compile();

    controller = module.get<PredictionsController>(PredictionsController);
    evsesService = module.get<EvsesService>(EvsesService);
    locationsService = module.get<LocationsService>(LocationsService);
    cacheService = module.get<CacheService>(CacheService);
    evsesPredictionsService = module.get<EvsePredictionsService>(EvsePredictionsService);
  });

  describe('EVSEs predictions', () => {
    describe('findByEvseId', () => {
      describe('and with timeframe', () => {
        it('should return result only for the specific timeframe', async () => {
          const timeframe = 15;
          const expectedResults = {
            evseId,
            locationId,
            uid,
            predictions: PredictionsFactory.generatePredictions('AVAILABLE', new Date(now), timeframe),
          } as any;

          jest.spyOn(evsesService, 'getByEvseId').mockResolvedValueOnce(Promise.resolve(`${locationId}_${uid}`));
          jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(CachePredictionsFactory.generatePredictions(new Date(now))));

          const results = await controller.findByEvseId(
            new ToolkitProject(fronyxProject as any),
            { evseId },
            new TimeframeQueryParams(timeframe)
          );

          expect(results).toEqual(expectedResults);
          expect(results.predictions.length).toBe(1);
        });
      });

      describe('and without timeframe', () => {
        it('should return result for all prediction within configured timeframe', async () => {
          const expectedResults = {
            evseId,
            locationId,
            uid,
            predictions: PredictionsFactory.generatePredictions('AVAILABLE', new Date(now)),
          } as any;


          jest.spyOn(evsesService, 'getByEvseId').mockResolvedValueOnce(Promise.resolve(`${locationId}_${uid}`));
          jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(CachePredictionsFactory.generatePredictions(new Date(now))));

          const results = await controller.findByEvseId(
            new ToolkitProject({ ...fronyxProject, max_timeframe: 1440 } as any),
            { evseId },
            new TimeframeQueryParams(null)
          );

          expect(results).toEqual(expectedResults);
          expect(results.predictions.length).toBe(97);
        });
      });

      describe('and with project configured with prediction_frequency PERIODIC', () => {
        it('should get the PERIODIC predictions from the cache', async () => {
          jest.spyOn(evsesService, 'getByEvseId').mockResolvedValueOnce(Promise.resolve(`${locationId}_${uid}`));
          jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(CachePredictionsFactory.generatePredictions(new Date(now))));

          const evsesPredictionsServiceMock = jest.spyOn(evsesPredictionsService, 'get');

          await controller.findByEvseId(
            new ToolkitProject({ ...fronyxProject, prediction_frequency: 'PERIODIC' } as any),
            { evseId },
            new TimeframeQueryParams(null)
          );


          expect(evsesPredictionsServiceMock.mock.calls[0][2]).toBe('PERIODIC');
        });
      });

      describe('and with project configured with prediction_frequency REAL_TIME', () => {
        it('should get the PERIODIC predictions from the cache', async () => {
          jest.spyOn(evsesService, 'getByEvseId').mockResolvedValueOnce(Promise.resolve(`${locationId}_${uid}`));
          jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(CachePredictionsFactory.generatePredictions(new Date(now))));

          const evsesPredictionsServiceMock = jest.spyOn(evsesPredictionsService, 'get');

          await controller.findByEvseId(
            new ToolkitProject({ ...fronyxProject, prediction_frequency: 'REAL_TIME' } as any),
            { evseId },
            new TimeframeQueryParams(null)
          );

          expect(evsesPredictionsServiceMock.mock.calls[0][2]).toBe('REAL_TIME');
        });
      });

      describe('and the requested predictions is expired', () => {
        it('should throw exception that we cannot predict the ID', async () => {
          const timeframe = 15;

          jest.spyOn(evsesService, 'getByEvseId').mockResolvedValueOnce(Promise.resolve(`${locationId}_${uid}`));
          jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(CachePredictionsFactory.generatePredictions(new Date(now - 30 * 60000))));

          try {
            await controller.findByEvseId(
              new ToolkitProject(fronyxProject as any),
              { evseId },
              new TimeframeQueryParams(timeframe)
            );
          } catch (err) {
            expect(err.message).toEqual('Sorry, we couldn\'t predict this ID now, try again later.');
          }
        });
      });

      describe('and the requested predictions is not available in cache', () => {
        it('should throw exception that we cannot predict the ID', async () => {
          const timeframe = 15;

          jest.spyOn(evsesService, 'getByEvseId').mockResolvedValueOnce(Promise.resolve(`${locationId}_${uid}`));
          jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(null));

          try {
            await controller.findByEvseId(
              new ToolkitProject(fronyxProject as any),
              { evseId },
              new TimeframeQueryParams(timeframe)
            );
          } catch (err) {
            expect(err.message).toEqual('Sorry, we couldn\'t predict this ID now, try again later.');
          }
        });
      });
    });

    describe('findByLocationAndEvse', () => {
      describe('and with timeframe', () => {
        it('should return result only for the specific timeframe', async () => {
          const timeframe = 15;
          const expectedResults = {
            evseId,
            locationId,
            uid,
            predictions: PredictionsFactory.generatePredictions('AVAILABLE', new Date(now), timeframe),
          } as any;

          jest.spyOn(evsesService, 'getByLocationIdEvseId').mockResolvedValueOnce(Promise.resolve(`${locationId}_${uid}`));
          jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(CachePredictionsFactory.generatePredictions(new Date(now))));

          const results = await controller.findByLocationAndEvse(
            new ToolkitProject(fronyxProject as any),
            { locationId, evseId },
            new TimeframeQueryParams(timeframe)
          );

          expect(results).toEqual(expectedResults);
          expect(results.predictions.length).toBe(1);
        });
      });

      describe('and without timeframe', () => {
        it('should return result for all prediction within configured timeframe', async () => {
          const expectedResults = {
            evseId,
            locationId,
            uid,
            predictions: PredictionsFactory.generatePredictions('AVAILABLE', new Date(now)),
          } as any;


          jest.spyOn(evsesService, 'getByLocationIdEvseId').mockResolvedValueOnce(Promise.resolve(`${locationId}_${uid}`));
          jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(CachePredictionsFactory.generatePredictions(new Date(now))));

          const results = await controller.findByLocationAndEvse(
            new ToolkitProject({ ...fronyxProject, max_timeframe: 1440 } as any),
            { locationId, evseId },
            new TimeframeQueryParams(null)
          );

          expect(results).toEqual(expectedResults);
          expect(results.predictions.length).toBe(97);
        });
      });

      describe('and with project configured with prediction_frequency PERIODIC', () => {
        it('should get the PERIODIC predictions from the cache', async () => {
          jest.spyOn(evsesService, 'getByLocationIdEvseId').mockResolvedValueOnce(Promise.resolve(`${locationId}_${uid}`));
          jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(CachePredictionsFactory.generatePredictions(new Date(now))));

          const evsesPredictionsServiceMock = jest.spyOn(evsesPredictionsService, 'get');

          await controller.findByLocationAndEvse(
            new ToolkitProject({ ...fronyxProject, prediction_frequency: 'PERIODIC' } as any),
            { locationId, evseId },
            new TimeframeQueryParams(null)
          );


          expect(evsesPredictionsServiceMock.mock.calls[0][2]).toBe('PERIODIC');
        });
      });

      describe('and with project configured with prediction_frequency REAL_TIME', () => {
        it('should get the PERIODIC predictions from the cache', async () => {
          jest.spyOn(evsesService, 'getByLocationIdEvseId').mockResolvedValueOnce(Promise.resolve(`${locationId}_${uid}`));
          jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(CachePredictionsFactory.generatePredictions(new Date(now))));

          const evsesPredictionsServiceMock = jest.spyOn(evsesPredictionsService, 'get');

          await controller.findByLocationAndEvse(
            new ToolkitProject({ ...fronyxProject, prediction_frequency: 'REAL_TIME' } as any),
            { locationId, evseId },
            new TimeframeQueryParams(null)
          );


          expect(evsesPredictionsServiceMock.mock.calls[0][2]).toBe('REAL_TIME');
        });
      });

      describe('and the requested predictions is expired', () => {
        it('should throw exception that we cannot predict the ID', async () => {
          const timeframe = 15;

          jest.spyOn(evsesService, 'getByLocationIdEvseId').mockResolvedValueOnce(Promise.resolve(`${locationId}_${uid}`));
          jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(CachePredictionsFactory.generatePredictions(new Date(now - 30 * 60000))));

          try {
            await controller.findByLocationAndEvse(
              new ToolkitProject(fronyxProject as any),
              { locationId, evseId },
              new TimeframeQueryParams(timeframe)
            );
          } catch (err) {
            expect(err.message).toEqual('Sorry, we couldn\'t predict this ID now, try again later.');
          }
        });
      });

      describe('and the requested predictions is not available in cache', () => {
        it('should throw exception that we cannot predict the ID', async () => {
          const timeframe = 15;

          jest.spyOn(evsesService, 'getByLocationIdEvseId').mockResolvedValueOnce(Promise.resolve(`${locationId}_${uid}`));
          jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(null));

          try {
            await controller.findByLocationAndEvse(
              new ToolkitProject(fronyxProject as any),
              { locationId, evseId },
              new TimeframeQueryParams(timeframe)
            );
          } catch (err) {
            expect(err.message).toEqual('Sorry, we couldn\'t predict this ID now, try again later.');
          }
        });
      });
    });

    describe('findMultipleEvsesPredictions', () => {
      describe('locationIdsEvseIds', () => {
        describe('and with timeframe', () => {
          it('should return result only for the specific timeframe', async () => {
            const timeframe = 15;
            const expectedResults = [
              {
                evseId,
                locationId,
                uid,
                predictions: PredictionsFactory.generatePredictions('AVAILABLE', new Date(now), timeframe),
              }
            ] as any;

            jest.spyOn(evsesService, 'getByLocationIdEvseId').mockResolvedValueOnce(Promise.resolve(`${locationId}_${uid}`));
            jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(CachePredictionsFactory.generatePredictions(new Date(now))));

            const results = await controller.findMultipleEvsesPredictions(
              new ToolkitProject(fronyxProject as any),
              {
                locationIdsEvseIds: `${locationId}_${evseId}`,
                timeframe: '15'
              },
            );

            expect(results).toEqual(expectedResults);
            expect(results[0].predictions.length).toBe(1);
          });
        });

        describe('and without timeframe', () => {
          it('should return result for all prediction within configured timeframe', async () => {
            const expectedResults = [
              {
                evseId,
                locationId,
                uid,
                predictions: PredictionsFactory.generatePredictions('AVAILABLE', new Date(now)),
              }
            ] as any;


            jest.spyOn(evsesService, 'getByLocationIdEvseId').mockResolvedValueOnce(Promise.resolve(`${locationId}_${uid}`));
            jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(CachePredictionsFactory.generatePredictions(new Date(now))));

            const results = await controller.findMultipleEvsesPredictions(
              new ToolkitProject(fronyxProject as any),
              {
                locationIdsEvseIds: `${locationId}_${evseId}`,
              },
            );

            expect(results).toEqual(expectedResults);
            expect(results[0].predictions.length).toBe(97);
          });
        });

        describe('and with project configured with prediction_frequency PERIODIC', () => {
          it('should get the PERIODIC predictions from the cache', async () => {
            jest.spyOn(evsesService, 'getByLocationIdEvseId').mockResolvedValueOnce(Promise.resolve(`${locationId}_${uid}`));
            jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(CachePredictionsFactory.generatePredictions(new Date(now))));

            const evsesPredictionsServiceMock = jest.spyOn(evsesPredictionsService, 'get');

            await controller.findMultipleEvsesPredictions(
              new ToolkitProject({ ...fronyxProject, prediction_frequency: 'PERIODIC' } as any),
              {
                locationIdsEvseIds: `${locationId}_${evseId}`,
              },
            );

            expect(evsesPredictionsServiceMock.mock.calls[0][2]).toBe('PERIODIC');
          });
        });

        describe('and with project configured with prediction_frequency REAL_TIME', () => {
          it('should get the PERIODIC predictions from the cache', async () => {
            jest.spyOn(evsesService, 'getByLocationIdEvseId').mockResolvedValueOnce(Promise.resolve(`${locationId}_${uid}`));
            jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(CachePredictionsFactory.generatePredictions(new Date(now))));

            const evsesPredictionsServiceMock = jest.spyOn(evsesPredictionsService, 'get');

            await controller.findMultipleEvsesPredictions(
              new ToolkitProject({ ...fronyxProject, prediction_frequency: 'REAL_TIME' } as any),
              {
                locationIdsEvseIds: `${locationId}_${evseId}`,
              },
            );

            expect(evsesPredictionsServiceMock.mock.calls[0][2]).toBe('REAL_TIME');
          });
        });

        describe('and the requested predictions is expired', () => {
          it('should throw exception that we cannot predict the ID', async () => {
            jest.spyOn(evsesService, 'getByLocationIdEvseId').mockResolvedValueOnce(Promise.resolve(`${locationId}_${uid}`));
            jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(CachePredictionsFactory.generatePredictions(new Date(now - 30 * 60000))));

            try {
              await controller.findMultipleEvsesPredictions(
                new ToolkitProject({ ...fronyxProject, prediction_frequency: 'REAL_TIME' } as any),
                {
                  locationIdsEvseIds: `${locationId}_${evseId}`,
                },
              );
            } catch (err) {
              expect(err.message).toEqual('Sorry, we couldn\'t predict this ID now, try again later.');
            }
          });
        });

        describe('and the requested predictions is not available in cache', () => {
          it('should throw exception that we cannot predict the ID', async () => {
            jest.spyOn(evsesService, 'getByLocationIdEvseId').mockResolvedValueOnce(Promise.resolve(`${locationId}_${uid}`));
            jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(null));

            try {
              await controller.findMultipleEvsesPredictions(
                new ToolkitProject({ ...fronyxProject, prediction_frequency: 'REAL_TIME' } as any),
                {
                  locationIdsEvseIds: `${locationId}_${evseId}`,
                },
              );
            } catch (err) {
              expect(err.message).toEqual('Sorry, we couldn\'t predict this ID now, try again later.');
            }
          });
        });
      });

      describe('evseIds', () => {
        describe('and with timeframe', () => {
          it('should return result only for the specific timeframe', async () => {
            const timeframe = 15;
            const expectedResults = [
              {
                evseId,
                locationId,
                uid,
                predictions: PredictionsFactory.generatePredictions('AVAILABLE', new Date(now), timeframe),
              }
            ] as any;

            jest.spyOn(evsesService, 'getByEvseId').mockResolvedValueOnce(Promise.resolve(`${locationId}_${uid}`));
            jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(CachePredictionsFactory.generatePredictions(new Date(now))));

            const results = await controller.findMultipleEvsesPredictions(
              new ToolkitProject(fronyxProject as any),
              {
                evseIds: evseId,
                timeframe: '15'
              },
            );

            expect(results).toEqual(expectedResults);
            expect(results[0].predictions.length).toBe(1);
          });
        });

        describe('and without timeframe', () => {
          it('should return result for all prediction within configured timeframe', async () => {
            const expectedResults = [
              {
                evseId,
                locationId,
                uid,
                predictions: PredictionsFactory.generatePredictions('AVAILABLE', new Date(now)),
              }
            ] as any;


            jest.spyOn(evsesService, 'getByEvseId').mockResolvedValueOnce(Promise.resolve(`${locationId}_${uid}`));
            jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(CachePredictionsFactory.generatePredictions(new Date(now))));

            const results = await controller.findMultipleEvsesPredictions(
              new ToolkitProject(fronyxProject as any),
              {
                evseIds: evseId,
              },
            );

            expect(results).toEqual(expectedResults);
            expect(results[0].predictions.length).toBe(97);
          });
        });

        describe('and with project configured with prediction_frequency PERIODIC', () => {
          it('should get the PERIODIC predictions from the cache', async () => {
            jest.spyOn(evsesService, 'getByEvseId').mockResolvedValueOnce(Promise.resolve(`${locationId}_${uid}`));
            jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(CachePredictionsFactory.generatePredictions(new Date(now))));

            const evsesPredictionsServiceMock = jest.spyOn(evsesPredictionsService, 'get');

            await controller.findMultipleEvsesPredictions(
              new ToolkitProject({ ...fronyxProject, prediction_frequency: 'PERIODIC' } as any),
              {
                evseIds: evseId,
              },
            );

            expect(evsesPredictionsServiceMock.mock.calls[0][2]).toBe('PERIODIC');
          });
        });

        describe('and with project configured with prediction_frequency REAL_TIME', () => {
          it('should get the PERIODIC predictions from the cache', async () => {
            jest.spyOn(evsesService, 'getByEvseId').mockResolvedValueOnce(Promise.resolve(`${locationId}_${uid}`));
            jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(CachePredictionsFactory.generatePredictions(new Date(now))));

            const evsesPredictionsServiceMock = jest.spyOn(evsesPredictionsService, 'get');

            await controller.findMultipleEvsesPredictions(
              new ToolkitProject({ ...fronyxProject, prediction_frequency: 'REAL_TIME' } as any),
              {
                evseIds: evseId,
              },
            );

            expect(evsesPredictionsServiceMock.mock.calls[0][2]).toBe('REAL_TIME');
          });
        });

        describe('and the requested predictions is expired', () => {
          it('should throw exception that we cannot predict the ID', async () => {
            jest.spyOn(evsesService, 'getByEvseId').mockResolvedValueOnce(Promise.resolve(`${locationId}_${uid}`));
            jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(CachePredictionsFactory.generatePredictions(new Date(now - 30 * 60000))));

            try {
              await controller.findMultipleEvsesPredictions(
                new ToolkitProject({ ...fronyxProject, prediction_frequency: 'REAL_TIME' } as any),
                {
                  evseIds: evseId,
                },
              );
            } catch (err) {
              expect(err.message).toEqual('Sorry, we couldn\'t predict this ID now, try again later.');
            }
          });
        });

        describe('and the requested predictions is not available in cache', () => {
          it('should throw exception that we cannot predict the ID', async () => {
            jest.spyOn(evsesService, 'getByEvseId').mockResolvedValueOnce(Promise.resolve(`${locationId}_${uid}`));
            jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(null));

            try {
              await controller.findMultipleEvsesPredictions(
                new ToolkitProject({ ...fronyxProject, prediction_frequency: 'REAL_TIME' } as any),
                {
                  evseIds: evseId,
                },
              );
            } catch (err) {
              expect(err.message).toEqual('Sorry, we couldn\'t predict this ID now, try again later.');
            }
          });
        });
      });

      describe('locationIdsUids', () => {
        describe('and with timeframe', () => {
          it('should return result only for the specific timeframe', async () => {
            const timeframe = 15;
            const expectedResults = [
              {
                locationId,
                uid,
                predictions: PredictionsFactory.generatePredictions('AVAILABLE', new Date(now), timeframe),
              }
            ] as any;

            jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(CachePredictionsFactory.generatePredictions(new Date(now))));

            const results = await controller.findMultipleEvsesPredictions(
              new ToolkitProject(fronyxProject as any),
              {
                locationIdsUids: `${locationId}_${uid}`,
                timeframe: '15'
              },
            );

            expect(results).toEqual(expectedResults);
            expect(results[0].predictions.length).toBe(1);
          });
        });

        describe('and without timeframe', () => {
          it('should return result for all prediction within configured timeframe', async () => {
            const expectedResults = [
              {
                locationId,
                uid,
                predictions: PredictionsFactory.generatePredictions('AVAILABLE', new Date(now)),
              }
            ] as any;

            jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(CachePredictionsFactory.generatePredictions(new Date(now))));

            const results = await controller.findMultipleEvsesPredictions(
              new ToolkitProject(fronyxProject as any),
              {
                locationIdsUids: `${locationId}_${uid}`,
              },
            );

            expect(results).toEqual(expectedResults);
            expect(results[0].predictions.length).toBe(97);
          });
        });

        describe('and with project configured with prediction_frequency PERIODIC', () => {
          it('should get the PERIODIC predictions from the cache', async () => {
            jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(CachePredictionsFactory.generatePredictions(new Date(now))));

            const evsesPredictionsServiceMock = jest.spyOn(evsesPredictionsService, 'get');

            await controller.findMultipleEvsesPredictions(
              new ToolkitProject({ ...fronyxProject, prediction_frequency: 'PERIODIC' } as any),
              {
                locationIdsUids: `${locationId}_${uid}`,
              },
            );

            expect(evsesPredictionsServiceMock.mock.calls[0][2]).toBe('PERIODIC');
          });
        });

        describe('and with project configured with prediction_frequency REAL_TIME', () => {
          it('should get the PERIODIC predictions from the cache', async () => {
            jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(CachePredictionsFactory.generatePredictions(new Date(now))));

            const evsesPredictionsServiceMock = jest.spyOn(evsesPredictionsService, 'get');

            await controller.findMultipleEvsesPredictions(
              new ToolkitProject({ ...fronyxProject, prediction_frequency: 'REAL_TIME' } as any),
              {
                locationIdsUids: `${locationId}_${uid}`,
              },
            );

            expect(evsesPredictionsServiceMock.mock.calls[0][2]).toBe('REAL_TIME');
          });
        });

        describe('and the requested predictions is expired', () => {
          it('should throw exception that we cannot predict the ID', async () => {
            jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(CachePredictionsFactory.generatePredictions(new Date(now - 30 * 60000))));

            try {
              await controller.findMultipleEvsesPredictions(
                new ToolkitProject({ ...fronyxProject, prediction_frequency: 'REAL_TIME' } as any),
                {
                  locationIdsUids: `${locationId}_${uid}`,
                },
              );
            } catch (err) {
              expect(err.message).toEqual('Sorry, we couldn\'t predict this ID now, try again later.');
            }
          });
        });

        describe('and the requested predictions is not available in cache', () => {
          it('should throw exception that we cannot predict the ID', async () => {
            jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(null));

            try {
              await controller.findMultipleEvsesPredictions(
                new ToolkitProject({ ...fronyxProject, prediction_frequency: 'REAL_TIME' } as any),
                {
                  locationIdsUids: `${locationId}_${uid}`,
                },
              );
            } catch (err) {
              expect(err.message).toEqual('Sorry, we couldn\'t predict this ID now, try again later.');
            }
          });
        });
      });
    });
  });

  describe('locations predictions', () => {
    describe('findByLocationIds', () => {
      describe('and with timeframe', () => {
        it('should return result only for the specific timeframe', async () => {
          const timeframe = 15;
          const expectedResults = [{
            id,
            predictions: PredictionsFactory.generatePredictions('AVAILABLE', new Date(now), timeframe),
          }] as any;

          jest.spyOn(locationsService, 'getById').mockResolvedValueOnce(Promise.resolve(location));
          jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(CachePredictionsFactory.generatePredictions(new Date(now))));

          const results = await controller.findByLocationIds(
            new ToolkitProject(fronyxProject as any),
            {
              locationIds: id,
              timeframe: JSON.stringify(timeframe)
            },
          );

          expect(results).toEqual(expectedResults);
          expect(results[0].predictions.length).toBe(1);
        });
      });

      describe('and without timeframe', () => {
        it('should return result for all prediction within configured timeframe', async () => {
          const expectedResults = [{
            id,
            predictions: PredictionsFactory.generatePredictions('AVAILABLE', new Date(now)),
          }] as any;


          jest.spyOn(locationsService, 'getById').mockResolvedValueOnce(Promise.resolve(location));
          jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(CachePredictionsFactory.generatePredictions(new Date(now))));

          const results = await controller.findByLocationIds(
            new ToolkitProject({ ...fronyxProject, max_timeframe: 1440 } as any),
            { locationIds: id, timeframe: null },
          );

          expect(results).toEqual(expectedResults);
          expect(results[0].predictions.length).toBe(97);
        });
      });

      describe('and with project configured with prediction_frequency PERIODIC', () => {
        it('should get the PERIODIC predictions from the cache', async () => {
          jest.spyOn(locationsService, 'getById').mockResolvedValueOnce(Promise.resolve(location));
          jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(CachePredictionsFactory.generatePredictions(new Date(now))));

          const evsesPredictionsServiceMock = jest.spyOn(evsesPredictionsService, 'get');

          await controller.findByLocationIds(
            new ToolkitProject({ ...fronyxProject, prediction_frequency: 'PERIODIC' } as any),
            { locationIds: id, timeframe: null }
          );

          expect(evsesPredictionsServiceMock.mock.calls[0][2]).toBe('PERIODIC');
        });
      });

      describe('and with project configured with prediction_frequency REAL_TIME', () => {
        it('should get the REAL_TIME predictions from the cache', async () => {
          jest.spyOn(locationsService, 'getById').mockResolvedValueOnce(Promise.resolve(location));
          jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(CachePredictionsFactory.generatePredictions(new Date(now))));

          const evsesPredictionsServiceMock = jest.spyOn(evsesPredictionsService, 'get');

          await controller.findByLocationIds(
            new ToolkitProject({ ...fronyxProject, prediction_frequency: 'REAL_TIME' } as any),
            { locationIds: id, timeframe: null }
          );

          expect(evsesPredictionsServiceMock.mock.calls[0][2]).toBe('REAL_TIME');
        });
      });

      describe('and the requested predictions is expired', () => {
        it('should throw exception that we cannot predict the ID', async () => {
          const timeframe = '15';

          jest.spyOn(locationsService, 'getById').mockResolvedValueOnce(Promise.resolve(location));
          jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(CachePredictionsFactory.generatePredictions(new Date(now - 30 * 60000))));

          try {
            await controller.findByLocationIds(
              new ToolkitProject(fronyxProject as any),
              { locationIds: id, timeframe },
            );
          } catch (err) {
            expect(err.message).toEqual('Sorry, we couldn\'t predict this ID now, try again later.');
          }
        });
      });

      describe('and the requested predictions is not available in cache', () => {
        it('should throw exception that we cannot predict the ID', async () => {
          const timeframe = '15';

          jest.spyOn(locationsService, 'getById').mockResolvedValueOnce(Promise.resolve(location));
          jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(null));

          try {
            await controller.findByLocationIds(
              new ToolkitProject(fronyxProject as any),
              { locationIds: id, timeframe },
            );
          } catch (err) {
            expect(err.message).toEqual('Sorry, we couldn\'t predict this ID now, try again later.');
          }
        });
      });

      describe('and the requested predictions with more than 42 location ids', () => {
        it('should throw exception too many parameters', async () => {
          const timeframe = '15';
          const locationIds = [];
          for (let i = 0; i < 43; i++) {
            locationIds.push(id);
          }

          jest.spyOn(locationsService, 'getById').mockResolvedValueOnce(Promise.resolve(location));
          jest.spyOn(cacheService, 'hGetAll').mockResolvedValueOnce(Promise.resolve(null));

          try {
            await controller.findByLocationIds(
              new ToolkitProject(fronyxProject as any),
              { locationIds: JSON.stringify(locationIds), timeframe },
            );
          } catch (err) {
            expect(err.message).toEqual('Too many query parameters. Please provide a maximum of 42 query parameters.');
          }
        });
      });
    });
  });
});
