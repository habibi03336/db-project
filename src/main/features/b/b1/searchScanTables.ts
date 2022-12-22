import localDBclient from '../../../instance/localDBclient';
import { error, success } from '../../../lib/status';

export default function (ipcMain: Electron.IpcMain): void {
  const channelName = 'searchScanTables';
  ipcMain.handle(channelName, async (event, arg) => {
    try {
      const searchWord = arg[0];
      const searchSql = `select table_name, row_num_count as table_rows from SCANNED_TABLE where table_name like '%${searchWord}%'`;
      const res = await localDBclient.select(searchSql);
      return success(res);
    } catch (err) {
      return error('');
    }
  });
}
