import {EditMessagePayload, MessageType} from "../../utils/types";
import React, { Dispatch, FC, SetStateAction } from "react";
import {AppDispatch} from "../../store";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import {editMessageThunk} from "../../store/messageSlice";
import {EditMessageActionsContainer, EditMessageInputField} from "../../utils/styles";

type Props = {
  selectedEditMessage: MessageType;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  onEditMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const EditMessageContainer:FC<Props> = ({
  selectedEditMessage,
  setIsEditing,
  onEditMessageChange,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const params: EditMessagePayload = {
      conversationId: parseInt(id!),
      messageId: selectedEditMessage.id,
      content: selectedEditMessage.content,
    };
    dispatch(editMessageThunk(params))
      .then(() => {
        setIsEditing(false);
      })
      .catch((err) => {
        setIsEditing(false);
      })
  }

  return (
    <div style={{ width: '100%' }}>
      <form onSubmit={onSubmit}>
        <EditMessageInputField
          value={selectedEditMessage.content}
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