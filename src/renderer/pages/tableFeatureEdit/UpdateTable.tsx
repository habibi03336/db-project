import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import Modal from 'renderer/components/Modal';
import Table from 'renderer/components/Table';
import {
  categoricTableOrder,
  categoricTableOrdering,
  numericTableOrder,
  numericTableOrdering,
} from 'renderer/constants/scanResultTableOrder';
import {
  BorderBox,
  Button,
  Column,
  Row,
  Strong,
  Wrapper,
} from 'renderer/CSScontainers';
import DBstate from 'renderer/states/DBstate';
import Selection from 'renderer/components/Selection';

const UpdateTable = () => {
  const dbState = useRecoilValue(DBstate);
  const { tableName, rowCount } = useParams();
  const [scanResult, setScanResult] = useState<{ [key: string]: any }>({
    categoricColumnsResult: [],
    numericColumnsResult: [],
  });
  const [selectedAttr, setSelectedAttr] = useState([]);
  const [reload, setReload] = useState(1);

  const onClickRow = (row) => {
    setSelectedAttr(row);
  };
  useEffect(() => {
    (async () => {
      if (tableName === undefined || rowCount === undefined) return;
      const res = await db.command.request('readScanResult', [tableName]);
      if (!res.status) return;
      res.data.numericColumnsResult.forEach((elem) => {
        elem.rowCount = rowCount;
      });
      res.data.categoricColumnsResult.forEach((elem) => {
        elem.rowCount = rowCount;
      });
      setScanResult({
        numericColumnsResult:
          res.data.numericColumnsResult.map(numericTableOrdering),
        categoricColumnsResult: res.data.categoricColumnsResult.map(
          categoricTableOrdering
        ),
      });
    })();
  }, [tableName, rowCount, reload]);

  const onDeleteFeature = async () => {
    const res = await db.command.request('deleteFeature', [
      tableName,
      selectedAttr[0],
    ]);
    if (!res.status) return;
    setSelectedAttr(null);
    setReload(reload + 1);
  };

  const onChangeType = async (newType) => {
    const res = await db.command.request('modifyFeatureDataType', [
      tableName,
      selectedAttr[0],
      newType,
    ]);
    if (!res.status) return;
    setSelectedAttr(null);
    setReload(reload + 1);
  };

  const onSelectFK = async (fk) => {
    const res = await db.command.request('mappingFK', [
      { tableName, columnName: selectedAttr[0], FKname: fk },
    ]);
    if (!res.status) return;
    setSelectedAttr(null);
    setReload(reload + 1);
  };

  return (
    <Wrapper>
      <Modal
        show={selectedAttr.length !== 0}
        onClose={() => {
          setSelectedAttr([]);
        }}
      >
        <Column style={{ width: '100%' }}>
          <Row>
            <Strong>{selectedAttr[0]}</Strong>
          </Row>
          <Row>
            <Button onClick={onDeleteFeature}>속성 삭제하기</Button>
          </Row>
          <Row>
            <Selection
              description="속성 변경하기"
              options={
                selectedAttr[1] === 'numeric' ? ['text', 'varchar'] : ['int']
              }
              onChange={onChangeType}
            />
          </Row>
          <Row>
            <Selection
              description="결합키 설정하기"
              options={['phone', 'ssn', 'email', 'car-number']}
              onChange={onSelectFK}
            />
          </Row>
        </Column>
      </Modal>
      <Column>
        {scanResult.numericColumnsResult.length > 0 && (
          <Row>
            <BorderBox>
              수치 속성
              <Table
                headers={numericTableOrder}
                rows={scanResult.numericColumnsResult}
                onClickRow={onClickRow}
              />
            </BorderBox>
          </Row>
        )}
        {scanResult.categoricColumnsResult.length > 0 && (
          <Row>
            <BorderBox>
              범주 속성
              <Table
                headers={categoricTableOrder}
                rows={scanResult.categoricColumnsResult}
                onClickRow={onClickRow}
              />
            </BorderBox>
          </Row>
        )}
      </Column>
    </Wrapper>
  );
};

export default UpdateTable;
