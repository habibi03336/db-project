import localDBclient from '../../../instance/localDBclient';
import { error, success } from '../../../lib/status';

export default function (ipcMain: Electron.IpcMain): void {
  const channelName = 'findTableFKs';
  ipcMain.handle(channelName, async (event, arg) => {
    try {
      const tableName = arg[0];
      const findFKsql = `select reference_key from ATTRIBUTES_OF_TABLES where table_name = '${tableName}' and reference_key is not null`;
      const res = await localDBclient.select(findFKsql);
      return success(res);
    } catch (e) {
      return error('');
    }
  });
}
