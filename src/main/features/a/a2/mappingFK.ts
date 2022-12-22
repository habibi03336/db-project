import localDBclient from '../../../instance/localDBclient';
import { error, success } from '../../../lib/status';

export default function (ipcMain: Electron.IpcMain): void {
  //
  const channelName = 'mappingFK';
  ipcMain.handle(channelName, async (event, arg) => {
    try {
      const { tableName, columnName, FKname } = arg[0];
      // update scan table file
      const updateAttributeSql = `update ATTRIBUTES_OF_TABLES set reference_key = '${FKname}' where table_name = '${tableName}' and attribute_name = '${columnName}'`;
      await localDBclient.sql(updateAttributeSql);
      return success();
    } catch (err) {
      return error(err);
    }
  });
}
