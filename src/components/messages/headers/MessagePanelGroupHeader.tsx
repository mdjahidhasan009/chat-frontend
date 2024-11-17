import { useContext, useState } from "react";
import { AuthContext } from "../../../utils/context/AuthContext";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { selectGroupById } from "../../../store/groupSlice";
import { AddGroupRecipientModal } from "../../modals/AddGroupRecipientModal";
import { MessagePanelHeaderIcons, MessagePanelHeaderStyle } from "../../../utils/styles";
import {PeopleGroup, PersonAdd} from "akar-icons";
import {toggleSidebar} from "../../../store/groupRecipientsSidebarSlice";

export const MessagePanelGroupHeader = () => {
  const [ showModal, setShowModal ] = useState(false);
  const user = useContext(AuthContext).user!;
  const { id } = useParams();
  const group = useSelector((state: RootState) => selectGroupById(state, parseInt(id!)));
  const dispatch = useDispatch<AppDispatch>();

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
          <span>{group?.title || 'Group'}</span>
        </div>
        <MessagePanelHeaderIcons>
          {user?.id === group?.owner?.id && (
            <PersonAdd
              cursor="pointer"
              size={30}
              onClick={() => setShowModal(true)}
            />
          )}
          <PeopleGroup
            cursor="pointer"
            size={30}
            onClick={() => dispatch(toggleSidebar())}
          />
        </MessagePanelHeaderIcons>
      </MessagePanelHeaderStyle>
    </>
  );
};
