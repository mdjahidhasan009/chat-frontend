import {FC, useContext} from "react";
import {useParams} from "react-router-dom";
import {AuthContext} from "../../utils/context/AuthContext";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store";
import {leaveGroupThunk, selectGroupById, toggleContextMenu} from "../../store/groupsSlice";
import {isGroupOwner} from "../../utils/helpers";
import {ContextMenu, ContextMenuItem} from "../../utils/styles";
import { IoMdExit, IoIosArchive } from 'react-icons/io';

export const GroupSidebarContextMenu: FC = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch<AppDispatch>();
  const points = useSelector((state: RootState) => state.groups.points);

  const group = useSelector((state: RootState) => selectGroupById(state, parseInt(id!)));

  const isOwner = isGroupOwner(user, group);

  const leaveGroup = () => {
    dispatch(leaveGroupThunk(parseInt(id!)))
      .finally(() => {
        dispatch(toggleContextMenu(false))
      })
  };

  return (
    <ContextMenu top={points.y} left={points.x}>
      <ContextMenuItem onClick={leaveGroup}>
        <IoMdExit size={20} color="#ff0000" />
        <span style={{ color: '#ff0000'}}>Leave Group</span>
      </ContextMenuItem>
      <ContextMenuItem>
        <IoIosArchive size={20} color="#fff" />
        <span style={{ color: '#fff'}}>Archive Group</span>
      </ContextMenuItem>
    </ContextMenu>
  );
};