import { useEffect, useState } from 'react';
import Modal from 'renderer/components/Modal';
import Selection from 'renderer/components/Selection';
import Table from 'renderer/components/Table';

import {
  BorderBox,
  Column,
  Input,
  Item,
  Row,
  Strong,
  Wrapper,
} from 'renderer/CSScontainers';
import round from 'renderer/lib/round';

const SingleTableJoin = () => {
  const [search, setSearch] = useState('');
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [soureFK, setSourceFK] = useState([]);
  const [selectedFk, setSelectedFK] = useState(null);
  const [targetTables, setTargetTables] = useState([]);
  const [joinResult, setJoinResult] = useState<{ [key: string]: any }>(null);

  useEffect(() => {
    (async () => {
      if (search === '') {
        setTables([]);
        return;
      }
      const res = await db.command.request('searchScanTables', [search]);
      if (!res.status) return;
      setTables(res.data);
    })();
  }, [search]);

  useEffect(() => {
    (async () => {
      if (selectedTable === null) return;
      const res = await db.command.request('findTableFKs', [selectedTable]);
      if (!res.status) return;
      setSourceFK(res.data.map((elem) => elem.reference_key));
    })();
  }, [selectedTable]);

  const onSelectFK = async (fk) => {
    setSelectedFK(fk);
    const res = await db.command.request('findTableJoinCandidate', [fk]);
    if (res.status)
      setTargetTables(
        res.data.filter((elem) => elem.table_name !== selectedTable)
      );
  };

  const onActivateJoin = async (targetTable: string) => {
    const res = await db.command.request('tableJoin', [
      selectedTable,
      targetTable,
      selectedFk,
    ]);
    setJoinResult(res.data);
  };

  return (
    <Column>
      <Modal
        show={selectedTable !== null}
        onClose={() => {
          setSelectedTable(null);
          setSourceFK([]);
          setTargetTables([]);
          setJoinResult(null);
          setSelectedFK(null);
        }}
      >
        <Strong>{selectedTable}</Strong>
        <Selection
          description="결합키를 선택하세요"
          options={soureFK}
          onChange={onSelectFK}
        />
        <Row>
          {targetTables.map((table) => {
            return (
              <Item
                key={table.table_name}
                onClick={() => onActivateJoin(table.table_name)}
              >
                <Column>
                  <BorderBox>
                    <Item>테이블 명: {table.table_name}</Item>
                    <Row>
                      <Item>레코드 수: {String(table.table_rows)}개</Item>
                    </Row>
                  </BorderBox>
                </Column>
              </Item>
            );
          })}
        </Row>
        {joinResult && (
          <Row>
            <Table
              headers={[
                '테이블A',
                '테이블A 레코드수',
                '결합 키 속성 A',
                '테이블B',
                '테이블B 레코드수',
                '결합 키 속성 B',
                '대표 결합키',
                '결과레코드 수',
                '결합성공률(w1)',
                '결합성공률(w2)',
              ]}
              rows={[
                [
                  joinResult.sourceT,
                  joinResult.sourceRowCount,
                  joinResult.sourceFK,
                  joinResult.targetT,
                  joinResult.targetRowCount,
                  joinResult.targetFK,
                  selectedFk,
                  joinResult.rowCount,
                  round(joinResult.rowCount / joinResult.sourceRowCount, 2),
                  round(joinResult.rowCount / joinResult.targetRowCount, 2),
                ],
              ]}
            />
          </Row>
        )}
      </Modal>
      <Row style={{ alignItems: 'center' }}>
        테이블 검색:{' '}
        <Input
          style={{ minHeight: '20px' }}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Row>
      <Row>
        {tables.map((table) => {
          return (
            <Item
              key={table.table_name}
              onClick={() => setSelectedTable(table.table_name)}
            >
              <Column>
                <BorderBox>
                  <Item>테이블 명: {table.table_name}</Item>
                  <Row>
                    <Item>레코드 수: {String(table.table_rows)}개</Item>
                  </Row>
                </BorderBox>
              </Column>
            </Item>
          );
        })}
      </Row>
    </Column>
  );
};

export default SingleTableJoin;
