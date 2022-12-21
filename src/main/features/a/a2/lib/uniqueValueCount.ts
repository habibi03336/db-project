export default function (records: any[]) {
  const set = new Set(records);
  return set.size;
}
