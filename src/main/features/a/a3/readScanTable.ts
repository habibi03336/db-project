import fs from 'fs/promises';
import path from 'path';
import dbClient from '../../../instance/dbClient';
import { error, success } from '../../../lib/status';

export default function (ipcMain: Electron.IpcMain): void {
  const channelName = 'readScanTable';
  ipcMain.handle(channelName, async (event, arg) => {
    try {
      const scanTablePath = path.join(dbClient.getFilePath(), 'scanTable');
      const res = await fs.readdir(scanTablePath);
      const tableNames = res.map((elem) => path.basename(elem, '.json'));
      return success(tableNames);
    } catch {
      return error('스캔 테이블을 읽는 중에 오류가 생겼습니다.');
    }
  });
}
