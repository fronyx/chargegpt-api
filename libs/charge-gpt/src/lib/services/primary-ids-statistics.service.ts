import { classificationStatisticsClient } from '@fronyx/persistence';

interface PrimaryIdStatistic {
  id: string;
  daily_observed: number[];
  daily_occupied: number[];
  weekly_observed: number[];
  weekly_occupied: number[];
  last_updated: Date;
}

export const getStatisticsByPrimaryId = async (
  primaryId: string
): Promise<PrimaryIdStatistic> => {
  const queryArray = [
    'SELECT *',
    'FROM root r',
    'WHERE r.id = @primaryId',
    'AND r.statistics_type = "classification"',
  ];
  const parameters = [
    {
      name: '@primaryId',
      value: primaryId,
    },
  ];

  const querySpec = {
    query: queryArray.join(' '),
    parameters,
  };

  const response = await classificationStatisticsClient
    .query(querySpec)
    .fetchNext();

  return resourceToPrimaryIdStatistics(response.resources[0]);
};

const resourceToPrimaryIdStatistics = (resourse: any): PrimaryIdStatistic => {
  if (!resourse) {
    return null;
  }

  return {
    id: resourse.id,
    daily_observed: resourse.daily_observed,
    daily_occupied: resourse.daily_occupied,
    weekly_observed: resourse.weekly_observed,
    weekly_occupied: resourse.weekly_occupied,
    last_updated: new Date(resourse.last_updated),
  };
};
