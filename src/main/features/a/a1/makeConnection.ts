import { app } from 'electron';
import path from 'path';
import fs from 'fs/promises';
import localDBclient from '../../../instance/localDBclient';
import dbClient from '../../../instance/dbClient';
import { error, success } from '../../../lib/status';
import checkFileExist from './lib/checkFileExist';

export default function makeConnection(ipcMain: Electron.IpcMain): void {
  const channelName = 'makeConnection';
  ipcMain.handle(channelName, async (event, arg) => {
    try {
      const dbInfo = arg[0];
      await dbClient.connect(dbInfo);
      if (!(await checkFileExist(dbClient.getFilePath()))) {
        // if the directory does not exist, create it

        await fs.mkdir(path.join(app.getAppPath(), 'data', 'databases'), {
          recursive: true,
        });
        await fs.copyFile(
          path.join(app.getAppPath(), 'data', 'default.db'),
          dbClient.getFilePath()
        );
      }
      localDBclient.initialize(dbClient.getFilePath());
      // should set PRAGMA foreign_keys = ON;
      await localDBclient.sql('PRAGMA foreign_keys = ON');
      return success('db연결 성공');
    } catch (e) {
      console.log(e);
      return error('db연결 실패');
    }
  });
}
