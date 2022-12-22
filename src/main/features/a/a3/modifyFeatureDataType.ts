import dbClient from '../../../instance/dbClient';
import { error, success } from '../../../lib/status';
import localDBclient from '../../../instance/localDBclient';
import numericTypes from '../../../resources/numericTypes';

/**
 * numeric values can be converted to text
 * text values can't be converted to numeric in many cases, so it is not allowed
 * we should check the type of the column before converting
 * if the type is numeric, we can convert it to text
 * it can be done by using the following sql
 * UPDATE table_name
 * SET column_name = CAST(column_name AS CHAR)
 * WHERE column_name IS NOT NULL;
 *
 * and then we should change the data type of the column to text
 * ALTER TABLE table_name MODIFY column_name TEXT;
 */
export default function (ipcMain: Electron.IpcMain): void {
  const channelName = 'modifyFeatureDataType';
  ipcMain.handle(channelName, async (event, arg) => {
    try {
      const modTable = arg[0];
      const colName = arg[1];
      const colType = arg[2];
      // check the type of the column from ATTRIBUTES_OF_TABLE
      const checkType = `select data_type from ATTRIBUTES_OF_TABLE where TABLE_NAME = '${modTable}' and COLUMN_NAME = '${colName}'`;
      const res = await localDBclient.select(checkType);
      if (numericTypes.has(res[0].data_type)) {
        // convert the column to text
        const convertToText = `UPDATE ${modTable} SET ${colName} = CAST(${colName} AS CHAR) WHERE ${colName} IS NOT NULL`;
        const res2 = await dbClient.sql(convertToText);
        // change the data type of the column to text
        const changeType = `ALTER TABLE ${modTable} MODIFY ${colName} TEXT`;
        const res3 = await dbClient.sql(changeType);
        // update the data type of the column in ATTRIBUTES_OF_TABLE and following NUMERIC_ATTRIBUTES or CATEGORIC_ATTRIBUTES
        const updateType = `update ATTRIBUTES_OF_TABLE set data_type = 'text' where TABLE_NAME = '${modTable}' and COLUMN_NAME = '${colName}'`;
        // delete the column from NUMERIC_ATTRIBUTES and insert it into CATEGORIC_ATTRIBUTES
        const deleteNumeric = `delete from NUMERIC_ATTRIBUTES where TABLE_NAME = '${modTable}' and COLUMN_NAME = '${colName}'`;
        const insertCategoric = `insert into CATEGORIC_ATTRIBUTES values ('${modTable}', '${colName}', 0)`; // 0 means the column has no special characters because it is converted from numeric to text
        const res4 = await localDBclient.sql(updateType);
        const res5 = await localDBclient.sql(deleteNumeric);
        const res6 = await localDBclient.sql(insertCategoric);
      } else {
        return error(
          "text values can't be converted to numeric in many cases, so it is not allowed"
        );
      }
      return success(0, 'modify succeed');
    } catch {
      return error('modify fail');
    }
  });
}
