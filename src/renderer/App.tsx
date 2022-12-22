import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import CSVUpload from './pages/UploadCSV';
import TableDomainScan from './pages/TableDomainScan';
import TableFeatureEdit from './pages/tableFeatureEdit/TableFeatureEdit';
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
  BorderBox,
  ViewPort,
} from './CSScontainers';
import isLoginState from './states/isLogin';
import Login from './pages/Login';

export default function App() {
  const isLogin = useRecoilValue(isLoginState);
  if (!isLogin) {
    return (
      <ViewPort>
        <Center>
          <Login />
        </Center>
      </ViewPort>
    );
  }
  return (
    <ViewPort>
      <SideBar>
        <List>
          <ListItem>
            <ConnectionStatus />
          </ListItem>
          <ListItem>
            <Link to="/uploadCsv">
              <BorderBox>CSV업로드</BorderBox>
            </Link>
          </ListItem>
          <ListItem>
            <Link to="/tableDomainScan">
              <BorderBox>테이블 도메인 스캔</BorderBox>
            </Link>
          </ListItem>
          <ListItem>
            <Link to="/tableFeatureEdit">
              <BorderBox>테이블 속성 편집</BorderBox>
            </Link>
          </ListItem>
          <ListItem>
            <Link to="/singleTableJoin">
              <BorderBox>단일 결합</BorderBox>
            </Link>
          </ListItem>
          {/* <ListItem>
            <Link to="/multipleTableJoin">다중 결합</Link>
          </ListItem>
          <ListItem>
            <Link to="/result">결과 조회</Link>
          </ListItem> */}
        </List>
      </SideBar>
      <Main>
        <Routes>
          <Route path="/uploadCsv" element={<CSVUpload />} />
          <Route path="/tableDomainScan" element={<TableDomainScan />} />
          <Route path="/tableFeatureEdit/*" element={<TableFeatureEdit />} />
          <Route path="/singleTableJoin" element={<SingleTableJoin />} />
          <Route path="/multipleTableJoin" element={<MultiTableJoin />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </Main>
    </ViewPort>
  );
}
