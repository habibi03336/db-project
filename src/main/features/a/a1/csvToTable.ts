import csv from 'csvtojson';
import path from 'path';
import { error, success } from '../../../lib/status';
import dbClient from '../../../instance/dbClient';

const isCsvFormat = (fullPath: string) => {
  const pathArray = fullPath.split('.');
  return pathArray[pathArray.length - 1] === 'csv';
};

const createTableCreateQuery = (tableName: string, headers: string[]) => {
  const columnQuerys = headers.map((header: string) => {
    return `${header} VARCHAR (255)`;
  });
  return `CREATE TABLE ${tableName} (${columnQuerys.join(', ')});`;
};

export default function (ipcMain: Electron.IpcMain): void {
  const channelName = 'csvToTable';
  ipcMain.handle(channelName, async (event, arg) => {
    // 작동 가능한 상황인지 필요한 것들 확인
    if (!arg[0]) return error('파일 경로가 전달되지 않았습니다.');
    if (!isCsvFormat(arg[0]))
      return error('파일이 csv 형식이 아닌 것 같습니다.');
    if (!dbClient.isDBconnected()) return error('db연결이 되어있지 않습니다.');

    // CSV 파일을 각 row가 객체로 담긴 배열로 읽어옴
    const csvArrays = await csv().fromFile(arg[0]);
    // 컬럼 headers
    const headers = Object.keys(csvArrays[0]);
    // 파일이름을 테이블 이름으로 사용
    const tableName = path.basename(arg[0], '.csv');

    // 테이블 생성
    const createTableQuery = createTableCreateQuery(tableName, headers);
    try {
      await dbClient.sql(createTableQuery);
    } catch (e) {
      console.log(e);
      return error('테이블 생성 중 오류가 생겼습니다.');
    }

    // row 데이터 insert
    try {
      const quries = [];
      for (let i = 0; i < csvArrays.length; i += 1) {
        const columns = Object.keys(csvArrays[i]);
        const values = Object.values(csvArrays[i]).map((val) => `'${val}'`);
        const query = `INSERT INTO ${tableName} ( ${columns.join(
          ', '
        )} ) VALUES ( ${values.join(', ')} )`;
        quries.push(query);
      }
      await Promise.all(quries.map((query) => dbClient.sql(query)));
    } catch {
      return error('데이터 insert 중에 오류가 발생했습니다.');
    }

    return success('csv를 테이블로 변환하는데 성공했습니다.');
  });
}
