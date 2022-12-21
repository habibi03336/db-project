import mariadb from 'mariadb';
import { app } from 'electron';
import path from 'path';

interface DBinfo {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
}
class DBClient {
  #client: null | mariadb.Connection = null;

  #dbInfo: null | DBinfo;

  async connect(config: DBinfo) {
    this.#dbInfo = config;
    this.#client = await mariadb.createConnection(config);
  }

  getFilePath() {
    return path.join(
      app.getAppPath(),
      'data',
      `${this.#dbInfo.host}-${this.#dbInfo.port}-${this.#dbInfo.database}`
    );
  }

  isDBconnected() {
    return this.#client !== null;
  }

  async sql(query: string) {
    if (this.#client === null) throw new Error('연결된 db가 없습니다.');
    const res = await this.#client.query(query);
    return res;
  }
}

export default new DBClient();
