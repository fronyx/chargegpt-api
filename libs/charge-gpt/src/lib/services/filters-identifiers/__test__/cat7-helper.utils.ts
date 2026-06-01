import { time } from 'console';
import { add, differenceInMinutes, format, parse } from 'date-fns';
import { now } from 'mongoose';

const fronyxDateFormat = 'yyyy-MM-dd HH:mm:ss';

export const formatDateToFronyxFormat = (date: Date): string => {
  return format(date, fronyxDateFormat);
};

export const translateResponseDateTimeToExpectedTime = (
  dateTime: string,
  currentTimestamp: number
): string => {
  if (startsWithDayOfTheWeek(dateTime)) {
    const parsedWeekCount = parseWeekCountExpectedOutput(dateTime);
    const expectedDayNameToNumber = dayNameToNumber(parsedWeekCount.dayName);
    const todaysNumber = new Date(currentTimestamp).getDay();
    const weekCount = (expectedDayNameToNumber < todaysNumber) ? parsedWeekCount.weekCount + 1 : parsedWeekCount.weekCount;
    const nextCalendarWeek = getNextCalendarWeek(weekCount, currentTimestamp);
    const nextDate = getDateFromCalendarWeek(nextCalendarWeek, expectedDayNameToNumber, currentTimestamp);
    const dateString = parsedWeekCount.dateTime;
    const [hour, minute] = dateString.split(':').map(Number);

    nextDate.setHours(hour, minute, 0);

    return formatDateToFronyxFormat(nextDate);
  }
  // check first character of dateTime
  else if (isStartWithSymbol(dateTime)) {
    const dateString = dateTime.slice(1);
    const [hour, minute] = dateString.split(':').map(Number);

    const futureDate = add(new Date(currentTimestamp), {
      hours: hour,
      minutes: minute,
    });

    return formatDateToFronyxFormat(futureDate);
  } else {
    const splitString = dateTime.split(' ');

    if (splitString.length === 1) {
      throwError(dateTime);
    }

    const [exactTime, dayString] = splitString;

    if (!isStartWithSymbol(dayString)) {
      throwError(dateTime);
    }

    const day = Number(dayString.slice(1));
    const [hour, minute] = exactTime.split(':').map(Number);

    const futureDate = add(new Date(currentTimestamp), {
      days: day,
    });

    futureDate.setHours(hour, minute, 0);

    return formatDateToFronyxFormat(futureDate);
  }
};

const DAY_OF_THE_WEEK = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

const startsWithDayOfTheWeek = (val: string): boolean => {
  return DAY_OF_THE_WEEK.some((day) => val.toLowerCase().startsWith(day));
};

// Sunday +0 08:00

export const getDayNameFromExpectedOutput = (expectedOutput: string): string => {
  const day = DAY_OF_THE_WEEK.find((day) => expectedOutput.toLowerCase().startsWith(day));
  if (!day) {
    throwError(expectedOutput);
  }

  return day;
}

export const getWeekCountFromExpectedOutput = (expectedOutput: string): number => {
  const splitString = expectedOutput.split(' ');

  if (splitString.length !== 3) {
    throwError(expectedOutput);
  }

  const weekCount = Number(splitString[1]);
  if (isNaN(weekCount)) {
    throwError(expectedOutput);
  }

  return weekCount;
};

export const getTimeFromExpectedOutput = (expectedOutput: string): string => {
  const splitString = expectedOutput.split(' ');

  if (splitString.length !== 3) {
    throwError(expectedOutput);
  }

  return splitString[2];
}

export const parseWeekCountExpectedOutput = (expectedOutput: string): { dayName: string; weekCount: number; dateTime: string; } => {
  return {
    dayName: getDayNameFromExpectedOutput(expectedOutput),
    weekCount: getWeekCountFromExpectedOutput(expectedOutput),
    dateTime: getTimeFromExpectedOutput(expectedOutput),
  };
}

const isStartWithSymbol = (val: string): boolean => {
  return val[0] === '+' || val[0] === '-';
};

const throwError = (val) => {
  throw new Error(`Unexpected date_time format provided: ${val}`);
};

export const isTimeWithin15Mins = (
  expectedString: string,
  receivedString: string
): boolean => {
  if (!expectedString || !receivedString) {
    return false;
  }

  const expectedDateTime = parse(expectedString, fronyxDateFormat, new Date());
  const receivedDateTime = parse(receivedString, fronyxDateFormat, new Date());

  return differenceInMinutes(expectedDateTime, receivedDateTime) <= 15;
};

export const getCalendarWeek = (currentDate: Date): number => {
  const date = new Date(currentDate.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  // January 4 is always in week 1.
  const week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
};

export const getDateFromCalendarWeek = (
  nextCalendarWeek: number,
  dayNumber: number,
  currentTimestamp: number,
): Date => {
  const nextDate = new Date(currentTimestamp);
  nextDate.setDate(
    nextDate.getDate() +
      ((nextCalendarWeek - getCalendarWeek(new Date(currentTimestamp))) * 7 + (dayNumber - 1))
  );

  return nextDate;
};

export const getNextCalendarWeek = (weekCount: number, currentTimestamp: number): number => {
  return getCalendarWeek(new Date(currentTimestamp)) + weekCount;
}

export const dayNameToNumber = (dayName: string): number => {
  return DAY_OF_THE_WEEK.indexOf(dayName.toLowerCase());
}

export const isSimilarOperatorName = (expected: string, received: string): boolean => {
  if (received.length > expected.length) {
    return received.startsWith(expected);
  } else {
    return expected.startsWith(received);
  }
}