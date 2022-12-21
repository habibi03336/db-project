import fs from 'fs/promises';
import path from 'path';
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
const numericTypes = new Set(['int']);
const categoricTypes = new Set(['text', 'varchar']);

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
          columnScan.uniqueValueCount = uniqueValueCount(columnRecords);
          const { min, max } = minMax(columnRecords);
          columnScan.min = min;
          columnScan.max = max;
          columnScan.isFKcandidate =
            columnScan.uniqueValueCount / rowCount > 0.9;
        }
        if (categoricTypes.has(DATA_TYPE)) {
          columnScan.typeCategory = 'categoric';
          columnScan.uniqueCategoryCount = uniqueCategoryCount(columnRecords);
          columnScan.specialCharCount = specialCharCount(columnRecords);
          columnScan.isFKcandidate =
            columnScan.uniqueCategoryCount / rowCount > 0.9;
        }
        columnsScanResults.push(columnScan);
      }
      const result = {
        tableName,
        rowCount,
        columns: columnsScanResults,
      };
      await fs.writeFile(
        path.join(dbClient.getFilePath(), 'scanTable', `${tableName}.json`),
        JSON.stringify(result)
      );
      return success(result, '테이블 특성 스캔 성공');
    } catch (err) {
      return error('테이블 특성 스캔 실패');
    }
  });
}
