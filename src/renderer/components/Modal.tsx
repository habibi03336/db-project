import React from 'react';
import { ModalBody, ModalContainer, Row } from 'renderer/CSScontainers';

const Modal = ({
  children,
  show,
  onClose,
}: {
  children: React.ReactNode;
  show: boolean;
  onClose: () => void;
}) => {
  return (
    <ModalContainer style={{ display: show ? '' : 'none' }}>
      <ModalBody>
        <Row
          style={{ justifyContent: 'flex-end', fontSize: '2rem' }}
          onClick={onClose}
        >
          {' '}
          X
        </Row>
        {children}
      </ModalBody>
    </ModalContainer>
  );
};

export default Modal;
