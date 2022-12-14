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
          description="???????????? ???????????????"
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
                    <Item>????????? ???: {table.table_name}</Item>
                    <Row>
                      <Item>????????? ???: {String(table.table_rows)}???</Item>
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
                '?????????A',
                '?????????A ????????????',
                '?????? ??? ?????? A',
                '?????????B',
                '?????????B ????????????',
                '?????? ??? ?????? B',
                '?????? ?????????',
                '??????????????? ???',
                '???????????????(w1)',
                '???????????????(w2)',
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
        ????????? ??????:{' '}
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
                  <Item>????????? ???: {table.table_name}</Item>
                  <Row>
                    <Item>????????? ???: {String(table.table_rows)}???</Item>
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
