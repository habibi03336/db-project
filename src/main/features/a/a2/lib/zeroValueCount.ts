export default function (records: any[]) {
  return records.reduce((pre, cur) => {
    if (cur === 0) return pre + 1;
    return pre;
  }, 0);
}
