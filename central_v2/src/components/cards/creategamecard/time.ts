const times = [
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
    value: 150,
    label: '2:30',
  },
  {
    value: 180,
    label: '3:00',
  },
  {
    value: 210,
    label: '3:30',
  },
  {
    value: 240,
    label: '4:00',
  },
  {
    value: 270,
    label: '4:30',
  },
  {
    value: 300,
    label: '5:00',
  }
];

export const reverseTimesMap = times.reduce(
  (acc, time) => {
    acc[time.label] = time.value;
    return acc;
  },
  {} as { [key: string]: number },
);

export const timeLookup = (value: number) => {
  const timeObj = times.find((time) => time.value === value);
  return timeObj ? timeObj.label : '';
};

export default times;
