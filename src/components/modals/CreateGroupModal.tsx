import React, {createRef, Dispatch, FC, useEffect, useState} from "react";
import {ConversationType} from "../../utils/types";
import {OverlayStyle} from "../../utils/styles";
import {ModalContainer, ModalContentBody, ModalHeader} from "./Index";
import {MdClose} from "react-icons/md";
import {CreateGroupForm} from "../forms/CreateGroupForm";

type Props = {
  setShowModal: Dispatch<React.SetStateAction<boolean>>;
};

export const CreateGroupModal: FC<Props> = ({ setShowModal }) => {
  const ref = createRef<HTMLDivElement>();
  const [type, setType] = useState<ConversationType>('group');

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) =>
      e.key === 'Escape' && setShowModal(false);
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { current } = ref;
    if (current === e.target) {
      setShowModal(false);
    }
  }

  return (
    <OverlayStyle ref={ref} onClick={handleOverlayClick}>
      <ModalContainer>
        <ModalHeader>
          <h2>Create a Group</h2>
          <MdClose size={32} onClick={() => setShowModal(false)} />
        </ModalHeader>
        <ModalContentBody>
          <CreateGroupForm setShowModal={setShowModal} />
        </ModalContentBody>
      </ModalContainer>
    </OverlayStyle>
  )
}