const times = [
    {
        value: 30,
        label: "0:30"
    },
    {
      value: 60,
      label: '1:00',
    },
    {
        value: 90,
        label: '1:30',
      },
    {
      value: 120,
      label: '2:00',
    },
    {
      value: 180,
      label: '3:00',
    },
    {
      value: 300,
      label: '5:00',
    },
    {
      value: 600,
      label: '10:00',
    },
  ]

export const reverseTimesMap = times.reduce((acc, time) => {
  acc[time.label] = time.value;
  return acc;
}, {} as {[key:string]: number});

  export default times