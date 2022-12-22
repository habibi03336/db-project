import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { BorderBox, Column, Item, Row, Wrapper } from 'renderer/CSScontainers';
import DBstate from 'renderer/states/DBstate';

const ShowScannedTable = () => {
  const dbState = useRecoilValue(DBstate);
  const [tables, setTables] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await db.command.request('readScanTable');
      if (res.status) setTables(res.data);
    })();
  }, [dbState.database]);

  return (
    <Wrapper>
      <Column>
        {tables.map((table) => {
          return (
            <Link
              key={table.table_name}
              to={`/tableFeatureEdit/table/${table.table_name}/${table.row_num_count}`}
            >
              <Item>
                <Column>
                  <BorderBox>
                    <Item>테이블 명: {table.table_name}</Item>
                    <Row>
                      <Item>레코드 수: {String(table.row_num_count)}개</Item>
                    </Row>
                  </BorderBox>
                </Column>
              </Item>
            </Link>
          );
        })}
      </Column>
    </Wrapper>
  );
};

export default ShowScannedTable;
