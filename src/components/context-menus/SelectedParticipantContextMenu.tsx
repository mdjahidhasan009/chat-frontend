import {FC, useContext} from 'react';
import { ContextMenu, ContextMenuItem } from '../../utils/styles';
import {getUserContextMenuActions, getUserContextMenuIcon} from "../../utils/helpers";
import {UserContextMenuActionType} from "../../utils/types";
import {userContextMenuItems} from "../../utils/constants";
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectGroupById} from "../../store/groupSlice";
import {AuthContext} from "../../utils/context/AuthContext";
import {RootState} from "../../store";

type Props = {
  points: { x: number; y: number };
};

type CustomIconProps = {
  type: UserContextMenuActionType;
};

export const CustomIcon: FC<CustomIconProps> = ({ type }) => {
  const { icon: MyIcon, color } = getUserContextMenuIcon(type);
  return <MyIcon size={20} color={color} />;
};

export const SelectedParticipantContextMenu: FC<Props> = ({ points }) => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const group = useSelector((state: RootState) =>
    selectGroupById(state, parseInt(id!))
  );

  return (
    <ContextMenu top={points.y} left={points.x}>
      {getUserContextMenuActions(user, group).map((item) => (
        <ContextMenuItem>
          <CustomIcon type={item.action} />
          <span style={{ color: item.color }}>{item.label}</span>
        </ContextMenuItem>
      ))}
    </ContextMenu>
  );
};