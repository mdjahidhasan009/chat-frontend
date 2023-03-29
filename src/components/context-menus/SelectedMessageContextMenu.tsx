import {Dispatch, FC, SetStateAction, useContext} from "react";
import {useParams} from "react-router-dom";
import {AuthContext} from "../../utils/context/AuthContext";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store";
import {deleteMessageThunk} from "../../store/messages/messageThunk";
import {ContextMenu, ContextMenuItem} from "../../utils/styles";
import {setIsEditing, setMessageBeingEdited} from "../../store/messageContainerSlice";
import {id} from "date-fns/locale";
import {selectType} from "../../store/selectedSlice";
import {deleteGroupMessageThunk} from "../../store/groupMessageSlice";

type Props = {
  points: { x: number, y: number };
};

export const SelectedMessageContextMenu: FC<Props> = ({ points}) => {
  const { id: routeId } = useParams();
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch<AppDispatch>();
  const conversationType = useSelector((state: RootState) => selectType(state));
  const { selectedMessage: message } = useSelector(
    (state: RootState) => state.messageContainer
  )

  const deleteMessage = () => {
    const id = parseInt(routeId!);
    if (!message) return;
    const messageId = message.id;
    return conversationType === 'private'
      ? dispatch(deleteMessageThunk({ id, messageId: message.id }))
      : dispatch(deleteGroupMessageThunk({ id, messageId }));
  }

  const editMessage = () => {
    dispatch(setIsEditing(true));
    dispatch(setMessageBeingEdited(message));
  }

  return (
    <ContextMenu top={points.y} left={points.x}>
      {message?.author.id === user?.id && (
        <ContextMenuItem onClick={deleteMessage}>Delete</ContextMenuItem>
      )}
      {message?.author.id === user?.id && (
        <ContextMenuItem onClick={editMessage}>Edit</ContextMenuItem>
      )}
    </ContextMenu>
  )
}