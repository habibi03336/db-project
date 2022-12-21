import fs from 'fs/promises';
import dbClient from '../../../instance/dbClient';
import { error, success } from '../../../lib/status';

export default function (ipcMain: Electron.IpcMain): void {
  //
  const channelName = 'mappingFK';
  ipcMain.handle(channelName, async (event, arg) => {
    try {
      const { tableName, columnName, FKname } = arg[0];
      // update scan table file
      const targetFilePath = `${dbClient.getFilePath()}/scanTable/${tableName}.json`;
      const buffer = await fs.readFile(targetFilePath);
      const tableScanData = JSON.parse(buffer.toString());
      const targetIndex = tableScanData.columns.findIndex(
        (column) => column.name === columnName
      );
      tableScanData.columns[targetIndex].fk = FKname;
      await fs.writeFile(targetFilePath, JSON.stringify(tableScanData));

      // update tableByPK file
      const FKfilePath = `${dbClient.getFilePath()}/tableByPK.json`;
      const buff = await fs.readFile(FKfilePath);
      const tableByPK = JSON.parse(buff.toString());
      tableByPK[FKname].push(tableName);
      await fs.writeFile(FKfilePath, JSON.stringify(tableByPK));

      return success();
    } catch (err) {
      return error(err.message);
    }
  });
}
