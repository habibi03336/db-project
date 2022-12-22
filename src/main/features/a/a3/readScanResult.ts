import localDBclient from '../../../instance/localDBclient';
import { error, success } from '../../../lib/status';

export default function (ipcMain: Electron.IpcMain): void {
  const channelName = 'readScanResult';
  ipcMain.handle(channelName, async (event, arg) => {
    try {
      const tableName = arg[0];
      const numericAttributesSql = `select a.attribute_name as name, 'numeric' as typeCategory, a.data_type as type, a.reference_key as fk, a.of_NULL_records as nullCount, a._of_distinct_records as uniqueCount, n.maximum_value as max, n.minimum_value as min, n._of_0_records as zeroCount from ATTRIBUTES_OF_TABLES as a, NUMERIC_ATTRIBUTES as n where a.table_name = '${tableName}' and a.table_name = n.table_name and a.attribute_name = n.attribute_name`;
      const categoricAttributeSql = `select a.attribute_name as name, 'categoric' as typeCategory, a.data_type as type, a.reference_key as fk, a.of_NULL_records as nullCount, a._of_distinct_records as uniqueCount, c._of_special_char_records as specialCharCount from ATTRIBUTES_OF_TABLES as a, CATEGORIC_ATTRIBUTES as c where a.table_name = '${tableName}' and a.table_name = c.table_name and a.attribute_name = c.attribute_name`;
      const numericColumnsResult = await localDBclient.select(
        numericAttributesSql
      );
      const categoricColumnsResult = await localDBclient.select(
        categoricAttributeSql
      );
      return success({ numericColumnsResult, categoricColumnsResult });
    } catch (err) {
      return error('스캔 테이블을 읽는 중에 오류가 생겼습니다.');
    }
  });
}
