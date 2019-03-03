let REQUEST = null;

export function requestCountdownTimer(endTime, callback) {
  // set our end time
  let actualEndTime = null;
  if (typeof endTime === 'string') {
    actualEndTime = transformStringToTime(endTime);
  } else {
    actualEndTime = endTime;
  }

  // calculate remaining time from now until deadline
  function getRemainingTime(deadline) {
    const currentTime = new Date().getTime();
    return deadline - currentTime;
  }
  
  // pad value with zero
  function pad(value) {
    return ('0' + Math.floor(value)).slice(-2);
  }

  // show time repeatedly
  function showTime() {
    const remainingTime = getRemainingTime(actualEndTime);
    const seconds = pad((remainingTime / 1000) % 60);
    const minutes = pad((remainingTime / (60 * 1000)) % 60);

    const newTime = `${minutes}:${seconds}`;
    if (newTime === '00:00') {
      callback('Time is up!');
      return;
    }
    callback(newTime);

    // ensure clock only updates if a second or more is remaining
    if (remainingTime >= 1000) {
      REQUEST = requestAnimationFrame(showTime);
    }
  }
  
  // kick it all off
  requestAnimationFrame(showTime);
};

export function cancelCountdownTimer() {
  cancelAnimationFrame(REQUEST);
}

function transformStringToTime(timeString = '00:00') {
  const minutes = parseInt(timeString.substr(0, timeString.indexOf(':')), 10);
  const seconds = parseInt(timeString.substr(timeString.indexOf(':') + 1), 10);
  return new Date().getTime() + (minutes * 60000) + (seconds * 1000);
}
