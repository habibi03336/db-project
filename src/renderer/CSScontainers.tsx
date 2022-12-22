import styled from 'styled-components';

export const Wrapper = styled.div`
  margin: 0;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: row;
`;
export const Main = styled.div`
  width: 80%;
`;
export const SideBar = styled.div`
  display: flex;
  flex-direction: column;
  width: 250px;
  border-right: 2px solid gray;
  height: 100%;
`;
export const List = styled.ul`
  padding: 0;
  list-style-type: none;
`;
export const ListItem = styled.li`
  padding: 15px;
`;

export const Column = styled.div`
  display: flex;
  min-width: 300px;
  flex-direction: column;
`;

export const BorderBox = styled.div`
  border: 2px solid black;
  border-radius: 10px;
  margin: 10px;
  padding: 10px;
`;

export const ModalContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
`;

export const ModalBody = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;

  width: 80%;
  height: 600px;

  padding: 40px;

  text-align: center;

  background-color: rgb(255, 255, 255);
  border-radius: 10px;
  box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);

  transform: translateX(-50%) translateY(-50%);
`;

export const Item = styled.div`
  margin: 5px;
  padding: 5px;
`;

export const Row = styled.div`
  display: flex;
  margin: 10px;
  flex-direction: row;
`;

export const Input = styled.input`
  min-height: 30px;
  padding: 5px;
  margin: 2px;
  border-radius: 5px;
`;

export const Button = styled.button`
  min-height: 40px;
  margin: 2px;
  border-radius: 5px;
`;
export const ErrorMessage = styled.div`
  opacity: 0;
  color: tomato;
`;

export const Center = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Strong = styled.strong``;

export const Selection = styled.select``;
export const Option = styled.option``;
