import { requestCountdownTimer } from '../../../utils/countdownTimer';


export default function (params, defaultTime, setTime) {
  let timeLeft;
  if (params && params.time) {
    timeLeft = defaultTime === '0:00' ? 'No time limit' : params.time;
  } else {
    timeLeft = defaultTime === '0:00' ? 'No time limit' : defaultTime;
  }
  if (timeLeft && (timeLeft !== '0:00' && timeLeft !== 'No time limit')) {
    requestCountdownTimer(timeLeft, setTime);
  }
}
