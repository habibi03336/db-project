import styled from 'styled-components';

const TableContainer = styled.table`
  border: 2px solid gray;
  padding: 5px;
`;
const TableHead = styled.thead`
  border: 2px solid gray;
  padding: 5px;
`;
const TableBody = styled.tbody`
  border: 2px solid gray;
  padding: 5px;
`;
const TableRow = styled.tr`
  border: 2px solid gray;
  padding: 5px;
`;
const TableTh = styled.th`
  border: 2px solid gray;
  padding: 5px;
`;
const TableTd = styled.td`
  border: 2px solid gray;
  padding: 5px;
`;

const Table = ({
  headers,
  rows,
  onClickRow,
}: {
  headers: string[];
  rows: any[][];
  onClickRow?: (args: { [key: string]: any }) => void;
}) => {
  return (
    <TableContainer>
      <TableHead>
        <TableRow>
          {headers.map((header) => (
            <TableTh key={header}>{header}</TableTh>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row[0]} onClick={() => onClickRow(row)}>
            <TableTh>{row[0]}</TableTh>
            {row.slice(1).map((data, idx) => {
              let showingData = data;
              if (typeof data === 'boolean') showingData = data ? 'O' : 'X';
              return <TableTd key={headers[idx]}>{showingData}</TableTd>;
            })}
          </TableRow>
        ))}
      </TableBody>
    </TableContainer>
  );
};
Table.defaultProps = {
  onClickRow: () => {},
};
export default Table;
