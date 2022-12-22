import dbClient from '../../../instance/dbClient';
import { error, success } from '../../../lib/status';
import localDBclient from '../../../instance/localDBclient';

export default function (ipcMain: Electron.IpcMain): void {
  const channelName = 'deleteFeature';
  ipcMain.handle(channelName, async (event, arg) => {
    try {
      const deleteTable = arg[0];
      const col = arg[1];
      const deleteSQL = `ALTER TABLE ${deleteTable} DROP COLUMN ${col} cascade`;
      const checkPKFKSQL = `select CONSTRAINT_NAME, REFERENCED_TABLE_SCHEMA, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME from information_schema.KEY_COLUMN_USAGE where TABLE_NAME = '${deleteTable}' and COLUMN_NAME = '${col}'`;
      const PKFK = await dbClient.sql(checkPKFKSQL);
      if (PKFK.length !== 0) {
        // delete all constraints
        PKFK.forEach(async (item) => {
          const deleteConstraintSQL = `ALTER TABLE ${deleteTable} DROP CONSTRAINT ${item.CONSTRAINT_NAME}`;
          await dbClient.sql(deleteConstraintSQL);
        });
      }
      const res = await dbClient.sql(deleteSQL);
      // delete from SCANNED_TABLE where TABLE_NAME = 'deleteTable' and COLUMN_NAME = 'col';
      const deleteScanTable = `delete from ATTRIBUTES_OF_TABLES where table_name = '${deleteTable}' and attribute_name = '${col}'`;
      const res2 = await localDBclient.sql(deleteScanTable);
      return success(0, 'delete succeed');
    } catch (err) {
      console.error(err);
      return error('delete fail');
    }
  });
}
