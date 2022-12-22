import localDBclient from '../../../instance/localDBclient';
import { error, success } from '../../../lib/status';

export default function (ipcMain: Electron.IpcMain): void {
  const channelName = 'readScanTable';
  ipcMain.handle(channelName, async (event, arg) => {
    try {
      const tableSelectSql = `select * from SCANNED_TABLE`;
      const rows = await localDBclient.select(tableSelectSql);
      return success(rows);
    } catch {
      return error('스캔 테이블을 읽는 중에 오류가 생겼습니다.');
    }
  });
}
