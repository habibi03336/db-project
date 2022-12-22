import {
  BorderBox,
  Center,
  Input,
  Item,
  Wrapper,
} from 'renderer/CSScontainers';

const UploadCSV = () => {
  const onInputCsv = async (e) => {
    e.preventDefault();
    if (
      e.target.files &&
      window.confirm(`${e.target.files[0].name} 파일을 업로드 하시겠습니까?`)
    ) {
      const res = await db.command.request('csvToTable', [
        e.target.files[0].path,
      ]);
      if (res.status) alert('테이블 업로드에 성공했습니다.😀');
      if (!res.status) alert(`${res.message}🥲`);
      e.target.value = null;
    }
  };
  return (
    <Wrapper style={{ height: '100vh' }}>
      <Center>
        <BorderBox>
          <Item>
            <Input type="file" onChange={onInputCsv} />
          </Item>
        </BorderBox>
      </Center>
    </Wrapper>
  );
};

export default UploadCSV;
