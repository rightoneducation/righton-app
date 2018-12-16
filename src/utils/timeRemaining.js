import debug from './debug';

const timeRemaining = (nextTime) => {
  if (!nextTime) return {};

  let actualNextTime;

  if (typeof nextTime !== 'number') {
    try {
      actualNextTime = nextTime.getTime();
    } catch (e) {
      debug.warn(`Bad input in timeRemaining(). Expected Date object, instead got ${typeof nextTime}:`, nextTime);
      return {};
    }
  }

  actualNextTime = nextTime;

  const now = Date.now();
  const nowDate = new Date();
  const nextDate = new Date(actualNextTime);

  const msRemaining = actualNextTime - now;

  let hourRemaining = Math.floor(msRemaining / 1000 / 60 / 60);
  const dayRemaining = hourRemaining >= 24 ? Math.floor(hourRemaining % 23) : 0;
  const minuteRemaining = Math.floor((msRemaining / 1000 / 60) % 60);
  const secondRemaining = Math.floor((msRemaining / 1000) % 60);

  const hoursBeforeNextGame = hourRemaining + nowDate.getHours();
  hourRemaining = dayRemaining > 0 ? hourRemaining - (dayRemaining * 24) : hourRemaining;
  let nextTimeDesc = '';
  if (hoursBeforeNextGame >= 24 && hoursBeforeNextGame < 48) {
    nextTimeDesc = 'Tomorrow';
  } else if (hoursBeforeNextGame < 24) {
    nextTimeDesc = 'Today';
  } else if (hoursBeforeNextGame >= 48) {
    nextTimeDesc = getPrettyDay(nextDate.getDay());
  }

  const nextHour = nextDate.getHours();
  let nextTimeHour;
  if (nextHour > 12) {
    nextTimeHour = nextHour - 12;
  } else if (nextHour === 0) {
    nextTimeHour = 12;
  } else {
    nextTimeHour = nextHour;
  }

  // Refer to MDN docs to understand why we take the opposite sign value of getTimezoneOffset()
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset
  const timezoneOffset = -nextDate.getTimezoneOffset() / 60;
  let timezone = '';
  switch (timezoneOffset) {
    case -6:
      timezone = 'CST';
      break;
    case -7:
      timezone = 'MST';
      break;
    case -8:
      timezone = 'PST';
      break;
    case -9:
      // Alaska
      timezone = 'AKST';
      break;
    case -10:
      // Hawaii-Aleutian
      timezone = 'HDT';
      break;
    case 13:
      // New Zealand
      timezone = 'NZDT';
      break;
    default:
      timezone = `UTC${timezoneOffset > 0 ? `+${timezoneOffset}` : `-${timezoneOffset}`}`;
  }
  const ampm = nextHour >= 12 ? 'PM' : 'AM';
  return {
    dayRemaining,
    hourRemaining,
    minuteRemaining,
    secondRemaining,
    nextTimeDesc,
    nextTimeHour,
    ampm,
    timezone,
  };
};

const getPrettyDay = (day) => {
  switch (day) {
    case 0:
      return 'Sunday';
    case 1:
      return 'Monday';
    case 2:
      return 'Tuesday';
    case 3:
      return 'Wednesday';
    case 4:
      return 'Thursday';
    case 5:
      return 'Friday';
    case 6:
      return 'Saturday';
    default:
      return '';
  }
};

export default timeRemaining;
