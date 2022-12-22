import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { BorderBox, Column, Item, Row, Wrapper } from 'renderer/CSScontainers';
import DBstate from 'renderer/states/DBstate';
import Table from 'renderer/components/Table';
import {
  categoricTableOrder,
  categoricTableOrdering,
  numericTableOrder,
  numericTableOrdering,
} from 'renderer/constants/scanResultTableOrder';
import Modal from 'renderer/components/Modal';

const TableDomainScan = () => {
  const dbState = useRecoilValue(DBstate);
  const [showResult, setShowResult] = useState(false);
  const [scanResult, setScanResult] = useState<{
    categoricColumnsResult: any[];
    numricColumnsResult: any[];
  }>({ categoricColumnsResult: [], numricColumnsResult: [] });
  const [tables, setTables] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await db.command.request('readTables', [dbState.database]);
      if (res.status) setTables(res.data);
    })();
  }, [dbState.database]);

  const onClickTable = async (tableInfo: any) => {
    if (
      !window.confirm(
        `${tableInfo.table_name}에 대한 테이블스캔을 진행하시겠습니까?`
      )
    ) {
      return;
    }
    setShowResult(true);
    const res = await db.command.request('scanTableFeature', [
      {
        tableName: tableInfo.table_name,
        rowCount: Number(tableInfo.table_rows),
      },
    ]);
    if (!res.status) console.log(res.message);
    res.data.columns.forEach((column) => {
      column.rowCount = Number(tableInfo.table_rows);
    });
    const categoricColumns = res.data.columns.filter(
      (column) => column.typeCategory === 'categoric'
    );
    const categoricColumnsResult = categoricColumns.map(categoricTableOrdering);
    const numericColumns = res.data.columns.filter(
      (column) => column.typeCategory === 'numeric'
    );
    const numricColumnsResult = numericColumns.map(numericTableOrdering);
    setScanResult({ categoricColumnsResult, numricColumnsResult });
  };

  return (
    <Wrapper>
      <Modal show={showResult} onClose={() => setShowResult(false)}>
        {scanResult.numricColumnsResult.length > 0 && (
          <Row>
            수치 속성
            <Table
              headers={numericTableOrder}
              rows={scanResult.numricColumnsResult}
            />
          </Row>
        )}
        {scanResult.categoricColumnsResult.length > 0 && (
          <Row>
            범주 속성
            <Table
              headers={categoricTableOrder}
              rows={scanResult.categoricColumnsResult}
            />
          </Row>
        )}
      </Modal>

      <Column>
        {tables.map((table) => {
          return (
            <Item key={table.table_name} onClick={() => onClickTable(table)}>
              <Column>
                <BorderBox>
                  <Item>테이블 명: {table.table_name}</Item>
                  <Row>
                    <Item>속성 개수: {table.column_name.length}개</Item>
                    <Item>레코드 수: {String(table.table_rows)}개</Item>
                  </Row>
                </BorderBox>
              </Column>
            </Item>
          );
        })}
      </Column>
    </Wrapper>
  );
};

export default TableDomainScan;
