import styled from 'styled-components';

const TableContainer = styled.table``;
const TableHead = styled.thead``;
const TableBody = styled.tbody``;
const TableRow = styled.tr``;
const TableTh = styled.th``;
const TableTd = styled.td``;

const Table = ({ headers, rows }: { headers: string[]; rows: any[][] }) => {
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
          <TableRow key={row[0]}>
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

export default Table;
