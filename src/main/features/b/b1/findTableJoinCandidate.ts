import localDBclient from '../../../instance/localDBclient';
import dbClient from '../../../instance/dbClient';
import { error, success } from '../../../lib/status';

export default function (ipcMain: Electron.IpcMain): void {
  const channelName = 'findTableJoinCandidate';
  ipcMain.handle(channelName, async (event, arg) => {
    try {
      const fk = arg[0];
      const findFKTablesSql = `select distinct t.table_name as table_name, t.row_num_count as table_rows from ATTRIBUTES_OF_TABLES as a, SCANNED_TABLE as t where t.table_name = a.table_name and a.reference_key = '${fk}'`;
      const res = await localDBclient.select(findFKTablesSql);
      return success(res);
    } catch {
      return error('');
    }
  });
}
