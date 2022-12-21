export default function (records: any[]) {
  return {
    max: Math.max(...records),
    min: Math.min(...records),
  };
}
