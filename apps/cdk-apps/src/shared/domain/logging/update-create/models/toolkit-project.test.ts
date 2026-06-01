import { ToolkitProject } from './toolkit-project';

describe('ToolkitProject', () => {
    describe('isEvseWithinScope', () => {
        describe('given project does not contain power_type filter configuration', () => {
            it('it identify all evses as out of scope', () => {
                const project = new ToolkitProject({
                    filters: [
                    ]
                } as any);
                const evse = {
                    connectors: [
                        {
                            power_type: 'DC',
                        }
                    ]
                } as any;

                expect(project.isEvseWithinScope(evse)).toBeFalsy();
            });
        });

        describe('given project contains DC filter configuration', () => {
            it('it should correctly identify evse with DC connector as in scope', () => {
                const project = new ToolkitProject({
                    filters: [
                        {
                            attribute: 'power_type',
                            value: 'DC',
                        }
                    ]
                } as any);
                const evse = {
                    connectors: [
                        {
                            power_type: 'DC',
                        }
                    ]
                } as any;

                expect(project.isEvseWithinScope(evse)).toBeTruthy();
            });

            it('it should identify evse with AC connector as out of scope', () => {
                const project = new ToolkitProject({
                    filters: [
                        {
                            attribute: 'power_type',
                            value: 'DC',
                        }
                    ]
                } as any);
                const evse = {
                    connectors: [
                        {
                            power_type: 'AC',
                        }
                    ]
                } as any;

                expect(project.isEvseWithinScope(evse)).toBeFalsy();
            });
        });

        describe('given project contains DC and AC filter configuration', () => {
            it('it should correctly identify evse with AC connector as in scope', () => {
                const project = new ToolkitProject({
                    filters: [
                        {
                            attribute: 'power_type',
                            value: 'DC',
                        },
                        {
                            attribute: 'power_type',
                            value: 'AC',
                        }
                    ]
                } as any);
                const evse = {
                    connectors: [
                        {
                            power_type: 'AC',
                        }
                    ]
                } as any;

                expect(project.isEvseWithinScope(evse)).toBeTruthy();
            });

            it('it should correctly identify evse with AC and DC connector as in scope', () => {
                const project = new ToolkitProject({
                    filters: [
                        {
                            attribute: 'power_type',
                            value: 'DC',
                        },
                        {
                            attribute: 'power_type',
                            value: 'AC',
                        }
                    ]
                } as any);
                const evse = {
                    connectors: [
                        {
                            power_type: 'DC',
                        },
                        {
                            power_type: 'AC',
                        },
                    ]
                } as any;

                expect(project.isEvseWithinScope(evse)).toBeTruthy();
            });
        });
    });

    describe('isLocationWithinScope', () => {
        describe('given a project with no filter configured', () => {
            it('should consider location as out of scope', () => {
                const project = new ToolkitProject({
                    filters: [
                    ]
                } as any);
                const location = {
                    country: 'DEU'
                } as any;

                expect(project.isLocationWithinScope(location)).toBeFalsy();
            })
        });

        describe('given a project with country DEU configured', () => {
            it('should consider location in DEU as in scope', () => {
                const project = new ToolkitProject({
                    filters: [
                        { attribute: 'country', value: 'DEU' }
                    ]
                } as any);
                const location = {
                    country: 'DEU'
                } as any;

                expect(project.isLocationWithinScope(location)).toBeTruthy();
            })
        });

        describe('given a project with country DEU and city Dortmund configured', () => {
            it('should consider location in DEU and Dortmund as in scope', () => {
                const project = new ToolkitProject({
                    filters: [
                        { attribute: 'country', value: 'DEU' },
                        { attribute: 'city', value: 'Dortmund' }
                    ]
                } as any);
                const location = {
                    country: 'DEU',
                    city: 'Dortmund'
                } as any;

                expect(project.isLocationWithinScope(location)).toBeTruthy();
            });

            it('should consider location in DEU and Berlin as out of scope', () => {
                const project = new ToolkitProject({
                    filters: [
                        { attribute: 'country', value: 'DEU' },
                        { attribute: 'city', value: 'Dortmund' }
                    ]
                } as any);
                const location = {
                    country: 'DEU',
                    city: 'Berlin'
                } as any;

                expect(project.isLocationWithinScope(location)).toBeFalsy();
            });
        });
    });
});