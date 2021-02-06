const CountPercentOfWin = (
  wins: number,
  defeat: number,
  draw: number
): number => {
  return (
    +parseFloat(((wins / (wins + defeat + draw)) * 100).toString()).toFixed(
      2
    ) || 0
  );
};
export default CountPercentOfWin;
