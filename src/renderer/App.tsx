import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import CSVUpload from './pages/UploadCSV';
import TableDomainScan from './pages/TableDomainScan';
import TableFeatureEdit from './pages/TableFeatureEdit';
import SingleTableJoin from './pages/SingleTableJoin';
import MultiTableJoin from './pages/MultiTableJoin';
import Result from './pages/Result';
import ConnectionStatus from './pages/ConnectionStatus';
import './App.css';
import {
  Wrapper,
  SideBar,
  List,
  ListItem,
  Main,
  Center,
} from './CSScontainers';
import isLoginState from './states/isLogin';
import Login from './pages/Login';

export default function App() {
  const isLogin = useRecoilValue(isLoginState);
  if (!isLogin) {
    return (
      <Wrapper>
        <Center>
          <Login />
        </Center>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <SideBar>
        <List>
          <ListItem>
            <ConnectionStatus />
          </ListItem>
          <ListItem>
            <Link to="/uploadCsv">CSV업로드</Link>
          </ListItem>
          <ListItem>
            <Link to="/tableDomainScan">테이블 도메인 스캔</Link>
          </ListItem>
          <ListItem>
            <Link to="/tableFeatureEdit">테이블 속성 편집</Link>
          </ListItem>
          <ListItem>
            <Link to="/singleTableJoin">단일 결합</Link>
          </ListItem>
          <ListItem>
            <Link to="/multipleTableJoin">다중 결합</Link>
          </ListItem>
          <ListItem>
            <Link to="/result">결과 조회</Link>
          </ListItem>
        </List>
      </SideBar>
      <Main>
        <Routes>
          <Route path="/uploadCsv" element={<CSVUpload />} />
          <Route path="/tableDomainScan" element={<TableDomainScan />} />
          <Route path="/tableFeatureEdit" element={<TableFeatureEdit />} />
          <Route path="/singleTableJoin" element={<SingleTableJoin />} />
          <Route path="/multipleTableJoin" element={<MultiTableJoin />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </Main>
    </Wrapper>
  );
}
