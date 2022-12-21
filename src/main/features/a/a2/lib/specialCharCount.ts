const format = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;

export default function (records: any[]) {
  return records.reduce((pre, cur) => {
    if (format.test(cur)) return pre + 1;
    return pre;
  }, 0);
}
