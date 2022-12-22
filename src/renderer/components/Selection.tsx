import { Column, Row } from 'renderer/CSScontainers';
import styled from 'styled-components';

const Select = styled.select`
  width: 50%;
  height: 2rem;
`;
const Option = styled.option`
  width: 50%;
  height: 2rem;
`;

const Selection = ({
  description,
  options,
  onChange,
}: {
  description: string;
  options: any[];
  onChange: (val: any) => void;
}) => {
  return (
    <Column>
      <Row>{description}</Row>
      <Select onChange={(e) => onChange(e.target.value)}>
        <Option defaultValue={undefined} hidden>
          선택해주세요.
        </Option>
        {options.map((option) => (
          <Option key={option} value={option}>
            {option}
          </Option>
        ))}
      </Select>
    </Column>
  );
};

export default Selection;
