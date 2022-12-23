import dbClient from '../../../instance/dbClient';
import { error, success } from '../../../lib/status';

export default function (ipcMain: Electron.IpcMain): void {
  const channelName = 'tableJoinMany';
  ipcMain.handle(channelName, async (event, arg) => {
    try {
      /*SELECT * FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';
SELECT table_Name IN DB_NAME WHERE reference_key = standard_reference_key
select * from INFORMATION_SCHEMA.COLUMNS where table_name=[table_name] 
                                                                        and column_name=[field_name]

SELECT TABLE_Name from INFORMATION_SCHEMA.COLUMNS
WHERE COLUMN_Name = attribute_name

SELECT * FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';
SELECT table_Name IN DB_NAME WHERE reference_key = standard_reference_key
SELECT table_Name from INFORMATION_SCHEMA.COLUMNS
WHERE column_name = attribute_name

SELECT *
 FROM tableA
          INNER JOIN tableB
          ON tableA.ID = tableB.key_ID
CREATE VIEW VIEW_NAME AS
SELECT table_name, #_of_NULL_records, representative_attribute, reference_key
FROM table_name
WHERE condition;
SELECT * FROM class.select_test*/
      return success();
    } catch {
      return error('');
    }
  });
}
