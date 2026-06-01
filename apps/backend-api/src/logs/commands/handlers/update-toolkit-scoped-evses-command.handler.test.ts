import { ToolkitProject } from '../../../../../cdk-apps/src/shared';
import { UpdateScopedEvsesCommandHandler } from './update-toolkit-scoped-evses-command.handler';

class ToolkitServiceFactory {
    projects = [];
    static periodicProject = {
        filters: [
            { attribute: 'country', value: 'DEU' },
            { attribute: 'power_type', value: 'DC' },
        ],
        prediction_frequency: 'PERIODIC',
    } as any;

    generateOnlyPeriodicProject(): ToolkitServiceFactory {
        this.projects.push(new ToolkitProject(ToolkitServiceFactory.periodicProject));
        return this;
    }

    generateOnlyRealTimeProject(): ToolkitServiceFactory {
        this.projects.push(new ToolkitProject({
            ...ToolkitServiceFactory.periodicProject,
            prediction_frequency: 'REAL_TIME',
        }));
        return this;
    }

    addExtraProject(payload: any): ToolkitServiceFactory {
        const factory = this.generateOnlyPeriodicProject();
        factory.projects.push(new ToolkitProject(payload));
        return factory;
    }
    
    getService(): any {
        return {
            getAllProjects: (): Promise<ToolkitProject[]> =>  {        
                return Promise.resolve(this.projects);
            }
        }
    };
}

class MockToolkitScopedEvsesPrimaryIdsService {
    async saveMany(args: any): Promise<void> {
        Promise.resolve();
        // NOOP
    }
}

describe('UpdateToolkitScopedEvsesCommandHandler', () => {
    describe('execute', () => {
        describe('given locations from evfreaks api are updated', () => {
            let toolkitScopedService;
            let toolkitScopedServiceSpy;

            beforeEach(() => {
                toolkitScopedService = new MockToolkitScopedEvsesPrimaryIdsService() as any;
                toolkitScopedServiceSpy = jest.spyOn(
                    toolkitScopedService,
                    'saveMany'
                );
            });

            describe('and 1 out of 2 location is within the scope', () => {
                const deuLocation = {
                    country: 'DEU',
                    evses: [
                        {
                            primary_id: 'foo1',
                            uid: 'uid',
                            evse_id: 'foo_evseid',
                            locationId: 'deuLocation',
                            connectors: [{ power_type: 'DC' }],
                        },
                    ],
                } as any;
                const nlLocation = {
                    country: 'NL',
                    evses: [
                        {
                            primary_id: 'foo2',
                            uid: 'uid2',
                            evse_id: 'foo_evseid2',
                            locationId: 'nlLocation',
                            connectors: [{ power_type: 'DC' }],
                        },
                    ],
                } as any;

                it('should store the evses within the location within the scope in the scope table', async () => {
                    const handler = new UpdateScopedEvsesCommandHandler(
                        new ToolkitServiceFactory().generateOnlyPeriodicProject().getService(),
                        toolkitScopedService
                    );

                    const expectedResults = {
                        scopedEvses: [
                            {
                                evse_id: 'foo_evseid',
                                evse_id_stripped: 'fooevseid',
                                location_id: 'deuLocation',
                                primary_id: 'foo1',
                                uid: 'uid',
                                is_real_time: false,
                            },
                        ],
                    };

                    await handler.execute({
                        location: [deuLocation, nlLocation],
                    });

                    expect(toolkitScopedServiceSpy).toHaveBeenCalledTimes(1);
                    expect(toolkitScopedServiceSpy).toHaveBeenCalledWith(expectedResults);
                });

                describe('and the project is configured with prediction frequency REAL_TIME', () => {
                    it('should store the evses within the location within the scope in the scope table as real time prediction', async () => {
                        const expectedResults = {
                            scopedEvses: [
                                {
                                    evse_id: 'foo_evseid',
                                    evse_id_stripped: 'fooevseid',
                                    location_id: 'deuLocation',
                                    primary_id: 'foo1',
                                    uid: 'uid',
                                    is_real_time: true,
                                },
                            ],
                        };
    
                        const handler = new UpdateScopedEvsesCommandHandler(
                            new ToolkitServiceFactory().generateOnlyRealTimeProject().getService(),
                            toolkitScopedService
                        );
    
                        await handler.execute({
                            location: [deuLocation, nlLocation],
                        });
    
                        expect(toolkitScopedServiceSpy).toHaveBeenCalledTimes(1);
                        expect(toolkitScopedServiceSpy).toHaveBeenCalledWith(expectedResults);
                    });
                });
            });

            describe('and the location is within only one of the project scope', () => {
                let toolkitService;

                beforeEach(() => {
                    toolkitService = new ToolkitServiceFactory()
                        .generateOnlyPeriodicProject()
                        .addExtraProject({
                            filters: [
                                { attribute: 'country', value: 'DEU' },
                                { attribute: 'power_type', value: 'AC' },
                            ],
                            prediction_frequency: 'REAL_TIME',
                        })
                        .getService();
                });

                describe('and the project that the location belongs to is configured with PERIODIC', () => {
                    it ('should save the evses as non real time id', async () => {
                        const deuLocation = {
                            country: 'DEU',
                            evses: [
                                {
                                    primary_id: 'foo1',
                                    uid: 'uid',
                                    evse_id: 'foo_evseid',
                                    locationId: 'deuLocation',
                                    connectors: [{ power_type: 'DC' }],
                                },
                            ],
                        } as any;

                        const handler = new UpdateScopedEvsesCommandHandler(
                            toolkitService,
                            toolkitScopedService
                        );
    
                        const expectedResults = {
                            scopedEvses: [
                                {
                                    evse_id: 'foo_evseid',
                                    evse_id_stripped: 'fooevseid',
                                    location_id: 'deuLocation',
                                    primary_id: 'foo1',
                                    uid: 'uid',
                                    is_real_time: false,
                                },
                            ],
                        };
    
                        await handler.execute({
                            location: [deuLocation],
                        });
    
                        expect(toolkitScopedServiceSpy).toHaveBeenCalledTimes(1);
                        expect(toolkitScopedServiceSpy).toHaveBeenCalledWith(expectedResults);
                    });
                });

                describe('and the project that the location belongs to is configured with REAL_TIME', () => {
                    it ('should save the evses as non real time id', async () => {
                        const deuLocation = {
                            country: 'DEU',
                            evses: [
                                {
                                    primary_id: 'foo1',
                                    uid: 'uid',
                                    evse_id: 'foo_evseid',
                                    locationId: 'deuLocation',
                                    connectors: [{ power_type: 'AC' }],
                                },
                            ],
                        } as any;

                        const handler = new UpdateScopedEvsesCommandHandler(
                            toolkitService,
                            toolkitScopedService
                        );
    
                        const expectedResults = {
                            scopedEvses: [
                                {
                                    evse_id: 'foo_evseid',
                                    evse_id_stripped: 'fooevseid',
                                    location_id: 'deuLocation',
                                    primary_id: 'foo1',
                                    uid: 'uid',
                                    is_real_time: true,
                                },
                            ],
                        };
    
                        await handler.execute({
                            location: [deuLocation],
                        });
    
                        expect(toolkitScopedServiceSpy).toHaveBeenCalledTimes(1);
                        expect(toolkitScopedServiceSpy).toHaveBeenCalledWith(expectedResults);
                    });
                });
            });
        });
    });
});
