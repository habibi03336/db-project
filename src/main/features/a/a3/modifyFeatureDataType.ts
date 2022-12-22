import dbClient from '../../../instance/dbClient';
import { error, success } from '../../../lib/status';
import localDBclient from '../../../instance/localDBclient';
import numericTypes from '../../../resources/numericTypes';
import DbClient from '../../../instance/dbClient';

/**
 * numeric values can be converted to colType
 * text values can't be converted to numeric if it contains non-numeric values like 'abc'
 * we should check the type of the column before converting
 */
export default function (ipcMain: Electron.IpcMain): void {
  const channelName = 'modifyFeatureDataType';
  ipcMain.handle(channelName, async (event, arg) => {
    try {
      const modTable = arg[0];
      const colName = arg[1];
      const colType = arg[2];
      // check the type of the column from ATTRIBUTES_OF_TABLE
      const checkType = `select data_type from ATTRIBUTES_OF_TABLES where table_name = '${modTable}' and attribute_name = '${colName}'`;
      const res = await localDBclient.select(checkType);
      if (numericTypes.has(res[0].data_type)) {
        // check if the column is a foreign key
        // if it is, save the constraint name, reference table name, reference column name
        const checkFK = `select CONSTRAINT_NAME, COLUMN_NAME, REFERENCED_TABLE_SCHEMA, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME from information_schema.KEY_COLUMN_USAGE where TABLE_NAME = '${modTable}' and COLUMN_NAME = '${colName}'`;
        const res4 = await dbClient.sql(checkFK);

        // add new new column with colType with meta data from res2
        const addNewCol = `alter table ${modTable} add ${colName}_new ${colType}`;
        await dbClient.sql(addNewCol);
        // update the new column with the old column
        const updateNewCol = `UPDATE ${modTable} SET ${colName}_new = CAST(${colName} AS CHAR)`;
        await dbClient.sql(updateNewCol);

        // restore the constraint if the column is a foreign key or primary key
        res4.forEach(async (item) => {
          const constraintName = item.CONSTRAINT_NAME;
          const refSchema = item.REFERENCED_TABLE_SCHEMA;
          const refTable = item.REFERENCED_TABLE_NAME;
          const refCol = item.REFERENCED_COLUMN_NAME;
          if (constraintName === 'PRIMARY') {
            const addPK = `ALTER TABLE ${modTable} ADD PRIMARY KEY (${colName})`;
            await dbClient.sql(addPK);
          } else {
            const restoreConstraint = `alter table ${modTable}
              add constraint ${constraintName} foreign key (${colName}) references ${refSchema}.${refTable} (${refCol})`;
            await dbClient.sql(restoreConstraint);
          }
        });

        // remove the constraint about the column
        if (res4.length !== 0) {
          res4.forEach(async (item) => {
            if (item.CONSTRAINT_NAME === 'PRIMARY') {
              // remove primary key
              const removePK = `ALTER TABLE ${modTable} DROP PRIMARY KEY`;
              await dbClient.sql(removePK);
            } else {
              const deleteConstraintSQL = `ALTER TABLE ${modTable} DROP CONSTRAINT ${item.CONSTRAINT_NAME}`;
              await dbClient.sql(deleteConstraintSQL);
            }
          });
        }

        // drop the old column after delete constraint about it
        const dropOldCol = `ALTER TABLE ${modTable} DROP COLUMN ${colName} cascade`;
        await dbClient.sql(dropOldCol);
        // rename the new column
        const renameNewCol = `ALTER TABLE ${modTable} CHANGE ${colName}_new ${colName} ${colType}`;
        await dbClient.sql(renameNewCol);

        // update the data type of the column in ATTRIBUTES_OF_TABLE and following NUMERIC_ATTRIBUTES or CATEGORIC_ATTRIBUTES
        const updateType = `update ATTRIBUTES_OF_TABLES set data_type = ${colType} where table_name = '${modTable}' and attribute_name = '${colName}'`;
        // delete the column from NUMERIC_ATTRIBUTES and insert it into CATEGORIC_ATTRIBUTES
        const deleteNumeric = `delete from NUMERIC_ATTRIBUTES where table_name = '${modTable}' and attribute_name = '${colName}'`;
        const insertCategoric = `insert into CATEGORIC_ATTRIBUTES values ('${modTable}', '${colName}', 0)`; // 0 means the column has no special characters because it is converted from numeric to text
        await localDBclient.sql(updateType);
        await localDBclient.sql(deleteNumeric);
        await localDBclient.sql(insertCategoric);
      } else {
        // categorical values can't be converted to numeric if it contains non-numeric values like 'abc', '#$%'
        // we should check the type of the column before converting

        // Get the data to check if it contains non-numeric values
        const getData = `select ${colName} from ${modTable}`;
        const res3 = await DbClient.sql(getData);
        // check if all of the values are Integer
        const isAllInteger = res3.every((item) => { return Number.isInteger(item[colName]); });
        // check if the data contains non-numeric values
        if (isAllInteger) {
          // check if the column is a foreign key
          // if it is, save the constraint name, reference table name, reference column name
          const checkFK = `select CONSTRAINT_NAME, COLUMN_NAME, REFERENCED_TABLE_SCHEMA, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME from information_schema.KEY_COLUMN_USAGE where TABLE_NAME = '${modTable}' and COLUMN_NAME = '${colName}'`;
          const res6 = await dbClient.sql(checkFK);

          // add new new column with colType with meta data from res2
          const addNewCol = `alter table ${modTable} add ${colName}_new ${colType}`;
          await dbClient.sql(addNewCol);
          // update the new column with the old column
          const updateNewCol = `UPDATE ${modTable} SET ${colName}_new = CAST(${colName} AS INT)`;
          await dbClient.sql(updateNewCol);

          // restore the constraint if the column is a foreign key or primary key
          res6.forEach(async (item) => {
            const constraintName = item.CONSTRAINT_NAME;
            const refSchema = item.REFERENCED_TABLE_SCHEMA;
            const refTable = item.REFERENCED_TABLE_NAME;
            const refCol = item.REFERENCED_COLUMN_NAME;
            if (constraintName === 'PRIMARY') {
              const addPK = `ALTER TABLE ${modTable} ADD PRIMARY KEY (${colName})`;
              await dbClient.sql(addPK);
            } else {
              const restoreConstraint = `alter table ${modTable}
              add constraint ${constraintName} foreign key (${colName}) references ${refSchema}.${refTable} (${refCol})`;
              await dbClient.sql(restoreConstraint);
            }
          });

          // remove the constraint about the column
          if (res6.length !== 0) {
            res6.forEach(async (item) => {
              if (item.CONSTRAINT_NAME === 'PRIMARY') {
                // remove primary key
                const removePK = `ALTER TABLE ${modTable} DROP PRIMARY KEY`;
                await dbClient.sql(removePK);
              } else {
                const deleteConstraintSQL = `ALTER TABLE ${modTable} DROP CONSTRAINT ${item.CONSTRAINT_NAME}`;
                await dbClient.sql(deleteConstraintSQL);
              }
            });
          }

          // drop the old column after delete constraint about it
          const dropOldCol = `ALTER TABLE ${modTable} DROP COLUMN ${colName} cascade`;
          await dbClient.sql(dropOldCol);
          // rename the new column
          const renameNewCol = `ALTER TABLE ${modTable} CHANGE ${colName}_new ${colName} ${colType}`;
          await dbClient.sql(renameNewCol);

          // update the data type of the column in ATTRIBUTES_OF_TABLE and following NUMERIC_ATTRIBUTES or CATEGORIC_ATTRIBUTES
          const updateType = `update ATTRIBUTES_OF_TABLES set data_type = ${colType} where table_name = '${modTable}' and attribute_name = '${colName}'`;
          // delete the column from NUMERIC_ATTRIBUTES and insert it into CATEGORIC_ATTRIBUTES
          const deleteCategoric = `delete from CATEGORIC_ATTRIBUTES where table_name = '${modTable}' and attribute_name = '${colName}'`;
          const insertNumeric = `insert into NUMERIC_ATTRIBUTES values ('${modTable}', '${colName}', 0)`; // 0 means the column has no special characters because it is converted from numeric to text
          await localDBclient.sql(updateType);
          await localDBclient.sql(deleteCategoric);
          await localDBclient.sql(insertNumeric);
        } else {
          return error('The column contains non-numeric values');
        }
        // shoud save the meta data of the attribute like not null, primary key, default value
        // and then restore it after changing the data type
      }
      return success(0, 'modify succeed');
    } catch (err) {
      console.error(err);
      return error('modify fail');
    }
  });
}
