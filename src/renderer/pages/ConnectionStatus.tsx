import { useRecoilValue } from 'recoil';
import { List, ListItem, Column, BorderBox } from 'renderer/CSScontainers';
import DBstate from 'renderer/states/DBstate';

const ConnectionStatus = () => {
  const dbInfo = useRecoilValue(DBstate);
  const fields: ['user', 'host', 'database', 'port'] = [
    'user',
    'host',
    'database',
    'port',
  ];
  return (
    <BorderBox>
      <Column>
        <List>
          {fields.map((field) => (
            <ListItem key={field} style={{ padding: 0 }}>
              {field} : {dbInfo[field]}
            </ListItem>
          ))}
        </List>
      </Column>
    </BorderBox>
  );
};

export default ConnectionStatus;
