import { useState } from 'react';
import {
  List,
  ListItem,
  Column,
  ErrorMessage,
  Input,
  Button,
} from 'renderer/CSScontainers';

interface DBstatus {
  user: string;
  host: string;
  database: string;
  password: string;
  port: string;
}

const defaultDBinfo =
  process.env.NODE_ENV === 'development'
    ? {
        user: 'root',
        host: 'localhost',
        database: 'test',
        password: '123',
        port: '5432',
      }
    : { user: '', host: '', database: '', password: '', port: '' };

const ConnectionStatus = () => {
  const [connected, setConnected] = useState(false);
  const [dbInfo, setInfo] = useState<DBstatus>(defaultDBinfo);
  const [error, setError] = useState(false);
  const getInput = (e: any) => {
    setInfo({ ...dbInfo, [e.target.name]: e.target.value });
  };

  const connectionSuccess = () => {
    setConnected(true);
  };
  const connectionFail = () => {
    setError(true);
    setTimeout(() => {
      setError(false);
    }, 3000);
  };
  const onClickConnection = async () => {
    const res = await db.command.request('makeConnection', [dbInfo]);
    if (!res.status) connectionFail();
    if (res.status) connectionSuccess();
  };
  const fields: ['user', 'host', 'database', 'password', 'port'] = [
    'user',
    'host',
    'database',
    'password',
    'port',
  ];
  if (!connected) {
    return (
      <Column>
        {fields.map((field) => (
          <Input
            value={dbInfo[field]}
            key={field}
            name={field}
            placeholder={field}
            onChange={getInput}
          />
        ))}
        <Button type="button" onClick={onClickConnection}>
          접속하기
        </Button>
        <ErrorMessage style={{ opacity: error ? 1 : 0 }}>
          정확하지 않은 접속정보입니다.
        </ErrorMessage>
      </Column>
    );
  }
  return (
    <Column>
      <List>
        {fields.map((field) => (
          <ListItem key={field} style={{ padding: 0 }}>
            {field} : {dbInfo[field]}
          </ListItem>
        ))}
      </List>
    </Column>
  );
};

export default ConnectionStatus;
