import fs from 'fs/promises';
import path from 'path';
import dbClient from '../../../instance/dbClient';
import { error, success } from '../../../lib/status';

export default function (ipcMain: Electron.IpcMain): void {
  //
  const channelName = 'mappingFK';
  ipcMain.handle(channelName, async (event, arg) => {
    try {
      const { tableName, columnName, FKname } = arg[0];
      // update scan table file
      const targetFilePath = path.join(
        dbClient.getFilePath(),
        'scanTable',
        `${tableName}.json`
      );
      const buffer = await fs.readFile(targetFilePath);
      const tableScanData = JSON.parse(buffer.toString());
      const targetIndex = tableScanData.columns.findIndex(
        (column) => column.name === columnName
      );

      const originalFK = tableScanData.columns[targetIndex].fk;
      tableScanData.columns[targetIndex].fk = FKname;
      await fs.writeFile(targetFilePath, JSON.stringify(tableScanData));

      // update tableByPK file
      const FKfilePath = path.join(dbClient.getFilePath(), 'tableByPK.json');
      const buff = await fs.readFile(FKfilePath);
      const tableByPK = JSON.parse(buff.toString());
      // delete tableName from tableByPK[originalFK] if originalFK is not null
      // tableByPK = {PKname : [[tableName1, columnName1], [tableName1, columnName2], [tableName2, columnName1], ...], ...}
      if (originalFK !== null) {
        const originalFKIndex = tableByPK[originalFK].findIndex(
          (table) => table[0] === tableName && table[1] === columnName
        );
        // if the table is not in tableByPK[originalFK], do nothing
        if (originalFKIndex !== -1) {
          tableByPK[originalFK].splice(originalFKIndex, 1);
        }
      }

      if (FKname !== null) {
        tableByPK[FKname].push([tableName, columnName]);
        await fs.writeFile(FKfilePath, JSON.stringify(tableByPK));
      }

      return success();
    } catch (err) {
      return error(err.message);
    }
  });
}
