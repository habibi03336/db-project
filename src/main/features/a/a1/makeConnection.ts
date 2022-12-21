import fs from 'fs/promises';
import { app } from 'electron';
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
      const file = `${app.getAppPath()}/data/${dbInfo.host}-${dbInfo.port}-${
        dbInfo.database
      }/tableByPK.json`;
      if (!(await checkFileExist(file))) {
        const dirPath = file.split('/').slice(0, -1).join('/');
        await fs.mkdir(dirPath, { recursive: true });
        await fs.mkdir(`${dirPath}/scanTable`);
        await fs.mkdir(`${dirPath}/join`);
        await fs.writeFile(file, JSON.stringify(DEFAULT_FK_DATA));
      }
      return success('db연결 성공');
    } catch (e) {
      return error('db연결 실패');
    }
  });
}
