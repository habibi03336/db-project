const sqlite3 = require('sqlite3').verbose();

class LocalDBClient {
  #client = null;

  initialize(dbPath: string) {
    this.#client = new sqlite3.Database(dbPath);
  }

  async sql(sql: string) {
    return new Promise((resolve) => {
      this.#client.exec(sql, (err) => {
        if (err === null) {
          resolve(true);
          return;
        }
        throw new Error(`sql실행시 에러가 발생했습니다\n ${err}`);
      });
    });
  }

  async select(sql: string) {
    return new Promise((resolve, reject) => {
      this.#client.all(sql, (err, row) => {
        if (err !== null) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  }
}

export default new LocalDBClient();
