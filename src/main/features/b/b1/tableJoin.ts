import dbClient from '../../../instance/dbClient';
import { error, success } from '../../../lib/status';


SELECT *
 FROM tableA
          INNER JOIN tableB
          ON tableA.ID = tableB.key_ID


CREATE VIEW VIEW_NAME AS
SELECT 테이블명, 레코드 수, 결합키 속 성명, 대표 결합키
FROM table_name
WHERE condition;

SELECT * FROM class.select_test
INTO OUTFILE '/home/stricky/select_csv/select_test.csv'
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n';

export default function (ipcMain: Electron.IpcMain): void {
  const channelName = 'tableJoin';
  ipcMain.handle(channelName, async (event, arg) => {
    try {
      return success();
    } catch {
      return error('');
    }
  });
}
