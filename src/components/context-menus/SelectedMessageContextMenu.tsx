import {Dispatch, FC, SetStateAction, useContext} from "react";
import {MessageMenuContext} from "../../utils/context/MessageMenuContext";
import {useParams} from "react-router-dom";
import {AuthContext} from "../../utils/context/AuthContext";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";
import {deleteMessageThunk} from "../../store/messageSlice";
import {ContextMenuStyle} from "../../utils/styles";

type Props = {
  points: { x: number, y: number };
  setIsEditing: Dispatch<SetStateAction<boolean>>;
};

export const SelectedMessageContextMenu: FC<Props> = ({
  points,
  setIsEditing,
}) => {
  const { message, setEditMessage } = useContext(MessageMenuContext);
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch<AppDispatch>();

  const deleteMessage = () => {
    const conversationId = parseInt(id!);
    if (!message) return;
    dispatch(deleteMessageThunk({ conversationId, messageId: message.id }));
  }

  const editMessage = () => {
    setIsEditing(true);
    setEditMessage(message);
  }

  return (
    <ContextMenuStyle top={points.y} left={points.x}>
      <ul>
        {message?.author.id === user?.id && (
          <li onClick={deleteMessage}>Delete</li>
        )}
        {message?.author.id === user?.id && <li onClick={editMessage}>Edit</li>}
      </ul>
    </ContextMenuStyle>
  )
}