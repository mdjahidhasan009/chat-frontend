import {AppDispatch, RootState} from "../../store";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {ConversationTypeData} from "../../utils/types";
import {updateType} from "../../store/selectedSlice";
import {ConversationSelectedItem, ConversationSelectedStyle} from "../../utils/styles";
import {chatTypes} from "../../utils/constants";

export const ConversationSelected = () => {
  const selectedType = useSelector(
    (state: RootState) => state.selectedConversationType.type
  );
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const onSelectType = (chat: ConversationTypeData) => {
    dispatch(updateType(chat.type));
    if (chat.type === 'group') navigate('/groups');
    else navigate('/conversations');
  };
  return (
    <ConversationSelectedStyle>
      {chatTypes.map((chat) => (
        <ConversationSelectedItem
          selected={chat.type === selectedType}
          key={chat.type}
          onClick={() => onSelectType(chat)}
        >
          {chat.label}
        </ConversationSelectedItem>
      ))}
    </ConversationSelectedStyle>
  )
}