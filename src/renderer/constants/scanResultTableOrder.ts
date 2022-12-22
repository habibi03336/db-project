import round from '../lib/round';

export const numericTableOrdering = ({
  rowCount,
  name,
  typeCategory,
  fk,
  nullCount,
  type,
  uniqueCount,
  min,
  max,
  zeroCount,
}) => [
  name,
  typeCategory,
  type,
  nullCount,
  round(nullCount / rowCount, 2),
  zeroCount,
  round(zeroCount / rowCount, 2),
  min,
  max,
  uniqueCount,
  uniqueCount / rowCount > 0.9,
  fk === undefined || fk === null ? false : fk,
];

export const numericTableOrder = [
  '속성명',
  '데이터 형식 분류',
  '데이터 형식',
  'null 개수',
  'null 비율',
  '0 개수',
  '0 비율',
  '최소',
  '최대',
  '상이 수치값',
  '결합키 후보',
  '결합키',
];

export const categoricTableOrdering = ({
  name,
  typeCategory,
  fk,
  nullCount,
  rowCount,
  specialCharCount,
  type,
  uniqueCount,
}) => [
  name,
  typeCategory,
  type,
  nullCount,
  round(nullCount / rowCount, 2),
  specialCharCount,
  round(specialCharCount / rowCount, 2),
  uniqueCount,
  uniqueCount / rowCount > 0.9,
  fk === undefined || fk === null ? false : fk,
];

export const categoricTableOrder = [
  '속성명',
  '데이터 형식 분류',
  '데이터 형식',
  'null 개수',
  'null 비율',
  '특수문자 포함 개수',
  '특수문자 비율',
  '상이 범주값',
  '결합키 후보',
  '결합키',
];
