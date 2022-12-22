import localDBclient from '../../../instance/localDBclient';
import dbClient from '../../../instance/dbClient';
import { error, success } from '../../../lib/status';
import minMax from './lib/minMax';
import nullCount from './lib/nullCount';
import specialCharCount from './lib/specialCharCount';
import uniqueCategoryCount from './lib/uniqueCategoryCount';
import uniqueValueCount from './lib/uniqueValueCount';
import zeroValueCount from './lib/zeroValueCount';

// Show features of the table
// arg[0] : table name
//

/**
 * this function is used to scan the table attributes
 * it will return two lists, one is for number type, the other is for string type
 *
 * if the attribute is a number type
 * ["attribute_name" : {"attribute_type", "number of records", "number of nulls",
 * "number of unique values", "min", "max", "the amount of 0 records", "mappingPK", "mappingFK"}]
 * if the attribute is a string type
 * ["attribute_name" : {"attribute_type", "number of records", "number of nulls",
 * "number of unique values", "number of records including special characters", "mappingPK", "mappingFK"}]
 *
 * special characters means the characters except for alphabets, numbers, and korean characters
 * if the attribute is not mapped, the value of mappingPK and mappingFK is null
 * if the attribute is mapped, the value of mappingPK and mappingFK is the representative name of PK and FK
 *
 * we can get those values using ./lib/*.ts (ex. ./lib/findDataType.ts)
 */
const numericTypes = new Set([
  'int',
  'tinyint',
  'smallint',
  'mediumint',
  'float',
  'double',
  'decimal',
  'numeric',
  'real',
  'bit',
  'boolean',
]);

export default function (ipcMain: Electron.IpcMain): void {
  const channelName = 'scanTableFeature';
  ipcMain.handle(channelName, async (event, arg) => {
    try {
      const { tableName } = arg[0];
      let { rowCount } = arg[0];
      rowCount = Number(rowCount);
      // sql query to get the table attributes
      // {column_name, data_type}
      const sql = `SELECT COLUMN_NAME, DATA_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = '${tableName}'`;
      const res: Array<{ COLUMN_NAME: string; DATA_TYPE: string }> =
        await dbClient.sql(sql);

      // get records for each attribute
      // allColumnRecords = [[{column_name : value}, {column_name : value}, ...], [{column_name : value}, {column_name : value}, ...], ...]
      const columnsScanResults = [];
      const allColumnRecords = await Promise.all(
        res.map(({ COLUMN_NAME }) => {
          const sqlStr = `SELECT ${COLUMN_NAME} FROM ${tableName}`;
          return dbClient.sql(sqlStr);
        })
      );

      // get the feature of each attribute
      for (let i = 0; i < res.length; i += 1) {
        const { COLUMN_NAME, DATA_TYPE } = res[i];
        const columnScan: { [key: string]: string | number | boolean } = {};
        // allColumnRecords[i] = [{column_name : value}, {column_name : value}, ...] ,all same column_name
        // columnRecords = [value, value, ...]
        const columnRecords = allColumnRecords[i].map(
          (elem) => Object.values(elem)[0]
        );

        columnScan.name = COLUMN_NAME;
        columnScan.type = DATA_TYPE;
        columnScan.nullCount = nullCount(columnRecords);

        if (numericTypes.has(DATA_TYPE)) {
          columnScan.typeCategory = 'numeric';
          columnScan.zeroCount = zeroValueCount(columnRecords);
          columnScan.uniqueCount = uniqueValueCount(columnRecords);
          const { min, max } = minMax(columnRecords);
          columnScan.min = min;
          columnScan.max = max;
          columnScan.isFKcandidate = columnScan.uniqueCount / rowCount > 0.9;
        } else {
          columnScan.typeCategory = 'categoric';
          columnScan.uniqueCount = uniqueCategoryCount(columnRecords);
          columnScan.specialCharCount = specialCharCount(columnRecords);
          columnScan.isFKcandidate = columnScan.uniqueCount / rowCount > 0.9;
        }
        columnsScanResults.push(columnScan);
      }
      const result = {
        tableName,
        rowCount,
        columns: columnsScanResults,
      };

      const checkExistSql = `select * from SCANNED_TABLE where table_name = '${tableName}'`;
      const checkRow = (await localDBclient.select(
        checkExistSql
      )) as Array<any>;
      if (checkRow.length !== 0) {
        const deleteSql1 = `delete from SCANNED_TABLE where table_name = '${tableName}'`;
        const deleteSql2 = `delete from ATTRIBUTES_OF_TABLES where table_name = '${tableName}'`;
        const deleteSql3 = `delete from NUMERIC_ATTRIBUTES where table_name = '${tableName}'`;
        const deleteSql4 = `delete from CATEGORIC_ATTRIBUTES where table_name = '${tableName}'`;
        await localDBclient.sql(deleteSql1);
        await localDBclient.sql(deleteSql2);
        await localDBclient.sql(deleteSql3);
        await localDBclient.sql(deleteSql4);
      }

      const insertNewTableSql = `insert into SCANNED_TABLE values('${tableName}', ${rowCount})`;
      await localDBclient.sql(insertNewTableSql);

      const sqls = [];
      for (let i = 0; i < columnsScanResults.length; i += 1) {
        const attribute = columnsScanResults[i];
        const insertAttributesSql = `insert into ATTRIBUTES_OF_TABLES values ('${tableName}', '${attribute.name}', '${attribute.type}', null, null, ${attribute.nullCount}, ${attribute.uniqueCount})`;
        sqls.push(insertAttributesSql);
        if (attribute.typeCategory === 'numeric') {
          const numericInsertSql = `insert into NUMERIC_ATTRIBUTES values ('${tableName}', '${attribute.name}', ${attribute.max}, ${attribute.min}, ${attribute.zeroCount})`;
          sqls.push(numericInsertSql);
        }
        if (attribute.typeCategory === 'categoric') {
          const categoricInsertSql = `insert into CATEGORIC_ATTRIBUTES values ('${tableName}', '${attribute.name}', ${attribute.specialCharCount})`;
          sqls.push(categoricInsertSql);
        }
      }
      await Promise.all(sqls.map((elem) => localDBclient.sql(elem)));

      return success(result, '테이블 특성 스캔 성공');
    } catch (err) {
      return error('테이블 특성 스캔 실패');
    }
  });
}

// 이미 존재하는 경우
// if (isExist) {
//   const sqls = [];
//   for (let i = 0; i < columnsScanResults.length; i += 1) {
//     const attribute = columnsScanResults[i];
//     // 컬럼 추가 시 예외처리
//     const insertAttributesSql = `update ATTRIBUTES_OF_TABLES set data_type = ${attribute.type}, #_of_NULL_records = ${attribute.nullCount}, #_of_distinct_record = ${attribute.uniqueCount} where table_name = ${tableName} and attribute_name=${attribute.name}`;
//     sqls.push(insertAttributesSql);
//     if (attribute.typeCategory === 'numeric') {
//       const numericInsertSql = `update NUMERIC_ATTRIBUTES set ${attribute.max}, ${attribute.min}, ${attribute.zeroCount} where table_name = ${tableName} and attribute_name=${attribute.name}`;
//       sqls.push(numericInsertSql);
//     }
//     if (attribute.typeCategory === 'categoric') {
//       const categoricInsertSql = `update CATEGORIC_ATTRIBUTES (${tableName}, ${attribute.name}, ${attribute.specialCharCount}) where table_name = ${tableName} and attribute_name=${attribute.name}`;
//       sqls.push(categoricInsertSql);
//     }
//   }
//   await Promise.all(sqls.map((elem) => localDBclient.sql(elem)));
// }
