// returns the number of nulls in an array
export default function (records: any[]) {
  let count = 0;
  for (let i = 0; i < records.length; i += 1) {
    if (records[i] === null) {
      count += 1;
    }
  }
  return count;
}
