import { formatDuration, intervalToDuration } from 'date-fns';

export const getTestCounter = (tests: any[]) => {
  let count = 1;
  const totalCount = tests.length;

  let startTime = Date.now();
  const durations = [];

  return {
    log: () => {
      durations.push((Date.now() - startTime));
      const averageDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
      const remainingTimeInSeconds = averageDuration * (totalCount - count) / 1000;

      const duration = intervalToDuration({
        start: 0,
        end: remainingTimeInSeconds * 1000,
      });

      console.log(
        'Running test:',
        count++,
        'out of',
        totalCount,
        '. Time remaining:',
        formatDuration(duration, {
          format: ['hours', 'minutes', 'seconds'],
        })
      );
      startTime = Date.now();
    },
  };
};
