const round = (num: number, place: number) => {
  return Math.floor(num * 10 ** place) / 10 ** place;
};
export default round;
