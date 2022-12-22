import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Row, Strong } from 'renderer/CSScontainers';
import ShowScannedTable from './ShowScannedTable';
import UpdateTable from './UpdateTable';

const TableFeatureEdit = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<ShowScannedTable />} />
        <Route path="/table/:tableName/:rowCount" element={<UpdateTable />} />
      </Routes>
    </div>
  );
};

export default TableFeatureEdit;
