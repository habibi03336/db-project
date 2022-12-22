import dbClient from '../../../instance/dbClient';
import { error, success } from '../../../lib/status';

export default function (ipcMain: Electron.IpcMain): void {
  const channelName = 'deleteFeature';
  ipcMain.handle(channelName, async (event, arg) => {
    try {
      const deleteTable = arg[0];
      const col = arg[1];
      const sqlStr = 'ALTER TABLE ';
      const deleteSQL = sqlStr.concat(deleteTable, ' DROP COLUMN ', col, ';');
      const res = await dbClient.sql(deleteSQL);
      // delete from SCANNED_TABLE where TABLE_NAME = 'deleteTable' and COLUMN_NAME = 'col';
      const deleteScanTable = `delete from SCANNED_TABLE where TABLE_NAME = '${deleteTable}' and COLUMN_NAME = '${col}'`;
      const res2 = await dbClient.sql(deleteScanTable);
      return success(0, 'delete succeed');
    } catch {
      return error('delete fail');
    }
  });
}
