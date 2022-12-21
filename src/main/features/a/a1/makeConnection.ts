import fs from 'fs/promises';
import path from 'path';
import checkFileExist from './lib/checkFileExist';
import dbClient from '../../../instance/dbClient';
import { error, success } from '../../../lib/status';

const DEFAULT_FK_DATA = {
  phone: [],
  ssn: [],
  email: [],
  ip: [],
  carNumber: [],
};

export default function makeConnection(ipcMain: Electron.IpcMain): void {
  const channelName = 'makeConnection';
  ipcMain.handle(channelName, async (event, arg) => {
    try {
      const dbInfo = arg[0];
      await dbClient.connect(dbInfo);
      const checkFile = path.join(dbClient.getFilePath(), 'tableByPK.json');
      if (!(await checkFileExist(checkFile))) {
        const dirPath = dbClient.getFilePath();
        await fs.mkdir(dirPath, { recursive: true });
        await fs.mkdir(path.join(dirPath, 'scanTable'));
        await fs.mkdir(path.join(dirPath, 'join'));
        await fs.writeFile(checkFile, JSON.stringify(DEFAULT_FK_DATA));
      }
      return success('db연결 성공');
    } catch (e) {
      return error('db연결 실패');
    }
  });
}
