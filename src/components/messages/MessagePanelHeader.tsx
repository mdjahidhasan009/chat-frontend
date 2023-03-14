import { MessagePanelHeaderStyle } from '../../utils/styles';
import {useContext, useState} from "react";
import {AuthContext} from "../../utils/context/AuthContext";
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectConversationById} from "../../store/conversationSlice";
import {RootState} from "../../store";
import {selectType} from "../../store/selectedSlice";
import {selectGroupById} from "../../store/groupSlice";
import { PersonAdd } from 'akar-icons';
import {AddGroupRecipientModal} from "../modals/AddGroupRecipientModal";

export const MessagePanelHeader = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);

  const type = useSelector(selectType);
  const conversation = useSelector((state: RootState) =>
    selectConversationById(state, parseInt(id!))
  );
  const group = useSelector((state: RootState) =>
    selectGroupById(state, parseInt(id!))
  );

  const displayName =
    user?.id === conversation?.creator.id
      ? `${conversation?.recipient.firstName} ${conversation?.recipient.lastName}`
      : `${conversation?.creator.firstName} ${conversation?.creator.lastName}`;
  const groupName = group?.title || 'Group';
  const headerTitle = type === 'group' ? groupName : displayName;

  return (
    <>
      {showModal && (
        <AddGroupRecipientModal
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
      <MessagePanelHeaderStyle>
        <div>
          <span>{headerTitle}</span>
        </div>
        {type === 'group' && user?.id === group?.creator?.id && (
          <PersonAdd size={30} onClick={() => setShowModal(true)} />
        )}
      </MessagePanelHeaderStyle>
    </>
  );
};