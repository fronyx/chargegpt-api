import { LocationTriplets, assignLabelToLocations, calculateLocationsScoreByAttribute, groupLocationsIntoOrderedGroups } from './recommendations-utils.functions';
import { Location } from '../models/prompt';

const createLocation = (args: Partial<Location>): Location => {
    return {
        locationId: 1,
        distance: 1,
        powerKw: 1,
        probability: 1,
        score: 0,
        ...args,
    } as unknown as Location;
};

describe('recommendations utils functions', () => {
    describe('groupLocationsIntoOrderedGroups', () => {
        it('should not error if locations is greater than 3', () => {
            expect(() => {
                groupLocationsIntoOrderedGroups([
                    createLocation({ locationId: '1' }),
                    createLocation({ locationId: '2' }),
                    createLocation({ locationId: '3' }),
                    createLocation({ locationId: '4' }),
                ], 'distance');
            }).not.toThrowError();
        });

        it('should not add the location into other group if all distance is the same', () => {
            const results = groupLocationsIntoOrderedGroups([
                createLocation({ locationId: '1', distance: 3 }),
                createLocation({ locationId: '2', distance: 3 }),
                createLocation({ locationId: '3', distance: 3 }),
            ], 'distance');

            expect(results.length).toEqual(1);
            expect(results[0]).toHaveLength(3);
        });

        it('should sort the locations into acsending order of distance and group', () => {
            const results = groupLocationsIntoOrderedGroups([
                createLocation({ locationId: '1', distance: 100 }),
                createLocation({ locationId: '2', distance: 200 }),
                createLocation({ locationId: '3', distance: 300 }),
            ], 'distance');

            expect(results[0][0].locationId).toEqual('1');
            expect(results[0]).toHaveLength(1);
            expect(results[1][0].locationId).toEqual('2');
            expect(results[1]).toHaveLength(1);
            expect(results[2][0].locationId).toEqual('3');
            expect(results[2]).toHaveLength(1);
        });

        it('should sort the location with the same distance together into one group', () => {
            const results = groupLocationsIntoOrderedGroups([
                createLocation({ locationId: '1', distance: 100 }),
                createLocation({ locationId: '2', distance: 200 }),
                createLocation({ locationId: '3', distance: 200 }),
            ], 'distance');

            expect(results).toHaveLength(2);
            expect(results[0][0].locationId).toEqual('1');
            expect(results[0]).toHaveLength(1);
            expect(results[1].map(({locationId}) => locationId).sort()).toEqual(['2', '3']);
            expect(results[1]).toHaveLength(2);
        });

        it('should not add the location into other group if all powerKw is the same', () => {
            const results = groupLocationsIntoOrderedGroups([
                createLocation({ locationId: '1', powerKw: 150 }),
                createLocation({ locationId: '2', powerKw: 150 }),
                createLocation({ locationId: '3', powerKw: 150 }),
            ], 'powerKw');

            expect(results).toHaveLength(1);
            expect(results[0]).toHaveLength(3);
        });

        it('should sort the locations into descending order of powerKw and group', () => {
            const results = groupLocationsIntoOrderedGroups([
                createLocation({ locationId: '1', powerKw: 1 }),
                createLocation({ locationId: '2', powerKw: 2 }),
                createLocation({ locationId: '3', powerKw: 3 }),
            ], 'powerKw');

            expect(results[0][0].locationId).toEqual('3');
            expect(results[0]).toHaveLength(1);
            expect(results[1][0].locationId).toEqual('2');
            expect(results[1]).toHaveLength(1);
            expect(results[2][0].locationId).toEqual('1');
            expect(results[2]).toHaveLength(1);
        });

        it('should sort the location with the same powerKw together into one group', () => {
            const results = groupLocationsIntoOrderedGroups([
                createLocation({ locationId: '1', powerKw: 2 }),
                createLocation({ locationId: '2', powerKw: 1 }),
                createLocation({ locationId: '3', powerKw: 1 }),
            ], 'powerKw');

            expect(results).toHaveLength(2);
            expect(results[0][0].locationId).toEqual('1');
            expect(results[0]).toHaveLength(1);
            expect(results[1].map(({locationId}) => locationId).sort()).toEqual(['2', '3']);
            expect(results[1]).toHaveLength(2);
        });

        it('should not add the location into other group if all probability is the same', () => {
            const results = groupLocationsIntoOrderedGroups([
                createLocation({ locationId: '1', probability: 150 }),
                createLocation({ locationId: '2', probability: 150 }),
                createLocation({ locationId: '3', probability: 150 }),
            ], 'probability');

            expect(results).toHaveLength(1);
            expect(results[0]).toHaveLength(3);
        });

        it('should sort the location into ascending order of probability and group', () => {
            const results = groupLocationsIntoOrderedGroups([
                createLocation({ locationId: '1', probability: 0.2 }),
                createLocation({ locationId: '2', probability: 0.5 }),
                createLocation({ locationId: '3', probability: 0.7 }),
            ], 'probability');

            expect(results[0][0].locationId).toEqual('1');
            expect(results[0]).toHaveLength(1);
            expect(results[1][0].locationId).toEqual('2');
            expect(results[1]).toHaveLength(1);
            expect(results[2][0].locationId).toEqual('3');
            expect(results[2]).toHaveLength(1);
        });

        it('should sort the location with the same probability together into one group', () => {
            const results = groupLocationsIntoOrderedGroups([
                createLocation({ locationId: '1', probability: 0.5 }),
                createLocation({ locationId: '2', probability: 0.6 }),
                createLocation({ locationId: '3', probability: 0.6 }),
            ], 'probability');

            expect(results).toHaveLength(2);
            expect(results[0][0].locationId).toEqual('1');
            expect(results[0]).toHaveLength(1);
            expect(results[1].map(({locationId}) => locationId).sort()).toEqual(['2', '3']);
            expect(results[1]).toHaveLength(2);
        });
    });

    describe('calculateLocationsScore', () => {
        it('should throw an error if input is invalid', () => {
            expect(() => {
                calculateLocationsScoreByAttribute([] as unknown as any, 'distance');
            }).toThrowError('Input needs to be in the format of Location[][]');
        });

        describe('distance', () => {
            let locations = [[], [], []] as unknown as LocationTriplets;

            beforeEach(() => {
                locations = [
                    [createLocation({ locationId: '1', distance: 100 }), createLocation({ locationId: '2', distance: 100 })],
                    [createLocation({ locationId: '3', distance: 200 })],
                    [createLocation({ locationId: '4', distance: 300 })],
                ];
            });

            it('should add 3 point to the nearest locations', () => {
                const results = calculateLocationsScoreByAttribute(locations, 'distance');
                results[0].forEach(({score}) => expect(score).toEqual(3));
            });

            it('should add 2 points to the second nearest locations', () => {
                const results = calculateLocationsScoreByAttribute(locations, 'distance');
                results[1].forEach(({score}) => expect(score).toEqual(2));
            });

            it('should add 1 points to the furthest locations', () => {
                const results = calculateLocationsScoreByAttribute(locations, 'distance');
                results[2].forEach(({score}) => expect(score).toEqual(1));
            });
        });

        describe('powerKw', () => {
            let locations = [[], [], []] as unknown as LocationTriplets;

            beforeEach(() => {
                locations = [
                    [createLocation({ locationId: '1', powerKw: 3 }), createLocation({ locationId: '2', powerKw: 3 })],
                    [createLocation({ locationId: '3', powerKw: 2 })],
                    [createLocation({ locationId: '4', powerKw: 1 })],
                ];
            });

            it('should add 1.5 points to the fastest locations', () => {
                const results = calculateLocationsScoreByAttribute(locations, 'powerKw');
                results[0].forEach(({score}) => expect(score).toEqual(1.5));
            });

            it('should add 1 points to the second fastest locations', () => {
                const results = calculateLocationsScoreByAttribute(locations, 'powerKw');
                results[1].forEach(({score}) => expect(score).toEqual(1));
            });

            it('should add 0.5 points to the slowest locations', () => {
                const results = calculateLocationsScoreByAttribute(locations, 'powerKw');
                results[2].forEach(({score}) => expect(score).toEqual(0.5));
            });
        });

        describe('probability', () => {
            let locations = [[], [], []] as unknown as LocationTriplets;

            beforeEach(() => {
                locations = [
                    [createLocation({ locationId: '1', probability: 0.2 }), createLocation({ locationId: '2', probability: 0.2 })],
                    [createLocation({ locationId: '3', probability: 0.5 })],
                    [createLocation({ locationId: '4', probability: 0.7 })],
                ];
            });

            it('should add 0.8999999999999999 points to the most available locations', () => {
                const results = calculateLocationsScoreByAttribute(locations, 'probability');
                results[0].forEach(({score}) => expect(score).toEqual(0.8999999999999999));
            });

            it('should add 0.6 points to the second most available locations', () => {
                const results = calculateLocationsScoreByAttribute(locations, 'probability');
                results[1].forEach(({score}) => expect(Math.round(score * 10) / 10).toEqual(0.6));
            });

            it('should add 0.3 points to the least available locations', () => {
                const results = calculateLocationsScoreByAttribute(locations, 'probability');
                results[2].forEach(({score}) => expect(score).toEqual(0.3));
            });
        });

        describe('score for all properties', () => {
            it('first place for nearest, fastest and most available should have a score of 5.4', () => {
                const locations = [[
                    createLocation({ locationId: '1', distance: 1, powerKw: 3, probability: 0.2 }),
                ], [], []] as unknown as LocationTriplets;
                const results = calculateLocationsScoreByAttribute(calculateLocationsScoreByAttribute(calculateLocationsScoreByAttribute(locations, 'distance'), 'powerKw'), 'probability');

                results[0].forEach(({score}) => expect(score).toEqual(5.4));
            });

            it('second place for distance, powerType and second most available should have a score of 5.4', () => {
                const locations = [[], [
                    createLocation({ locationId: '1', distance: 1, powerKw: 3, probability: 0.2 }),
                ], []] as unknown as LocationTriplets;
                const results = calculateLocationsScoreByAttribute(calculateLocationsScoreByAttribute(calculateLocationsScoreByAttribute(locations, 'distance'), 'powerKw'), 'probability');

                results[0].forEach(({score}) => expect(score).toEqual(5.4));
            });

            it('last place for distance, powerType and least available should have a score of 1.8', () => {
                const locations = [[], [], [
                    createLocation({ locationId: '1', distance: 1, powerKw: 3, probability: 0.2 }),
                ]] as unknown as LocationTriplets;
                const results = calculateLocationsScoreByAttribute(calculateLocationsScoreByAttribute(calculateLocationsScoreByAttribute(locations, 'distance'), 'powerKw'), 'probability');

                results[0].forEach(({score}) => expect(score).toEqual(1.8));
            });
        });
    });

    describe('assignLabelToLocations', () => {
        it('should not throw error if locations is greater than 3', () => {
            const locations: LocationTriplets = [[
                createLocation({ locationId: '1' }),
                createLocation({ locationId: '2' }),
                createLocation({ locationId: '3' }),
                createLocation({ locationId: '4' }),
            ], [], []];

            expect(() => {
                assignLabelToLocations(locations, locations, locations);
            }).not.toThrowError('locationIdPool cannot be greater than 3');
        });

        it('should not assign any label if there is more than 1 locations in the first stage of the group', () => {
            const locationsGroupedByDistance: LocationTriplets = [[
                createLocation({ locationId: '1' }),
                createLocation({ locationId: '2' }),
            ], [], []];
            const locationsGroupedByPowerKw: LocationTriplets = [[], [], []];
            const locationsGroupedByProbability: LocationTriplets = [[], [], []];

            const results = assignLabelToLocations(locationsGroupedByDistance, locationsGroupedByPowerKw, locationsGroupedByProbability);

            expect(results.isNearest).toEqual(null);
            expect(results.isFastest).toEqual(null);
            expect(results.isMostAvailable).toEqual(null);
        });

        it('should only assign the label to the first stage of the group that contains only one location', () => {
            const locationsGroupedByDistance: LocationTriplets = [[
                createLocation({ locationId: '1' }),
                createLocation({ locationId: '2' }),
            ], [], []];
            const locationsGroupedByPowerKw: LocationTriplets = [[
                createLocation({ locationId: '1' }),
                createLocation({ locationId: '2' }),
            ], [], []];
            const locationsGroupedByProbability: LocationTriplets = [[createLocation({locationId: '3'})], [], []];

            const results = assignLabelToLocations(locationsGroupedByDistance, locationsGroupedByPowerKw, locationsGroupedByProbability);

            expect(results.isNearest).toEqual(null);
            expect(results.isFastest).toEqual(null);
            expect(results.isMostAvailable).toEqual('3');
        });

        it('should only use the first stage for labelling', () => {
            const locationsGroupedByDistance: LocationTriplets = [[
                createLocation({ locationId: '1' }),
            ], [], []];

            const locationsGroupedByPowerKw: LocationTriplets = [[], [
                createLocation({ locationId: '2' }),
            ], []];

            const locationsGroupedByProbability: LocationTriplets = [[], [], [
            ]];

            const results = assignLabelToLocations(locationsGroupedByDistance, locationsGroupedByPowerKw, locationsGroupedByProbability);

            expect(results.isNearest).toEqual('1');
            expect(results.isFastest).toEqual(null);
            expect(results.isMostAvailable).toEqual(null);
        });
    });
});