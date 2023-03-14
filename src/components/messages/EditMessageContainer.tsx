import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { setIsEditing } from '../../store/messageContainerSlice';
import { editMessageThunk } from '../../store/messageSlice';
import {
  EditMessageActionsContainer,
  EditMessageInputField,
} from '../../utils/styles';
import { EditMessagePayload } from '../../utils/types';
import {selectType} from "../../store/selectedSlice";
import {editGroupMessageThunk} from "../../store/groupMessageSlice";

type Props = {
  onEditMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
export const EditMessageContainer: FC<Props> = ({ onEditMessageChange }) => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { messageBeingEdited } = useSelector(
    (state: RootState) => state.messageContainer
  );
  const conversationType = useSelector((state: RootState) => selectType(state));

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!messageBeingEdited) {
      return;
    }

    const params: EditMessagePayload = {
      id: parseInt(id!),
      messageId: messageBeingEdited.id,
      content: messageBeingEdited.content,
    };
    
    conversationType === 'private'
      ? dispatch(editMessageThunk(params)).finally(() =>
        dispatch(setIsEditing(false))
      )
      : dispatch(editGroupMessageThunk(params)).finally(() =>
        dispatch(setIsEditing(false))
      )
  };

  return (
    <div style={{ width: '100%' }}>
      <form onSubmit={onSubmit}>
        <EditMessageInputField
          value={messageBeingEdited?.content}
          onChange={onEditMessageChange}
        />
      </form>
      <EditMessageActionsContainer>
        <div>
          escape to <span>cancel</span> - enter to <span>save</span>
        </div>
      </EditMessageActionsContainer>
    </div>
  );
};