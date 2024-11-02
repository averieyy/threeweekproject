export function toTimeString(time: number) {
  const hours = Math.floor(time / 3600000);
  const minutes = Math.floor(time / 60000) % 60;

  const hourstext = hours != 0 && hours.toString().padStart(2, '0') + ':';
  const minutestext = (hours != 0 || minutes != 0) && minutes.toString().padStart(2, '0') + ':';
  const secondstext = Math.floor((time / 1000) % 60).toString().padStart(2, '0');
  const millisecondstext = (time % 1000).toString().padStart(3, '0');

  return `${hourstext || ''}${minutestext || ''}${secondstext}.${millisecondstext}`;
}