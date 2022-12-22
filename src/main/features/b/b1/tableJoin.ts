import localDBclient from '../../../instance/localDBclient';
import dbClient from '../../../instance/dbClient';
import { error, success } from '../../../lib/status';

/**
 *
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

 */

export default function (ipcMain: Electron.IpcMain): void {
  const channelName = 'tableJoin';
  ipcMain.handle(channelName, async (event, arg) => {
    try {
      const [sourceT, targetT, fk] = arg;
      const findSourceFKSql = `select attribute_name from ATTRIBUTES_OF_TABLES where table_name = '${sourceT}' and reference_key = '${fk}'`;
      const res = await localDBclient.select(findSourceFKSql);
      const sourceFKname = res[0].attribute_name;
      const findTargetFKSql = `select attribute_name from ATTRIBUTES_OF_TABLES where table_name = '${targetT}' and reference_key = '${fk}'`;
      const res2 = await localDBclient.select(findTargetFKSql);
      const targetFKname = res2[0].attribute_name;

      const joinSql = `select s.${sourceFKname} from ${sourceT} as s, ${targetT} as t where s.${sourceFKname} = t.${targetFKname}`;
      const res3 = await dbClient.sql(joinSql);

      const sourceRowCountSql = `select row_num_count from SCANNED_TABLE where table_name = '${sourceT}'`;
      const sourceRowCount = (await localDBclient.select(sourceRowCountSql))[0]
        .row_num_count;

      const targetRowCountSql = `select row_num_count from SCANNED_TABLE where table_name = '${targetT}'`;
      const targetRowCount = (await localDBclient.select(targetRowCountSql))[0]
        .row_num_count;

      return success({
        sourceFK: sourceFKname,
        sourceT,
        sourceRowCount,
        targetT,
        targetFK: targetFKname,
        targetRowCount,
        rowCount: res3.length,
      });
    } catch (e) {
      console.log(e);
      return error('');
    }
  });
}
