import { FC, useContext } from "react";
import { Friend } from "../../utils/types";
import { AuthContext } from "../../utils/context/AuthContext";
import { CallSidebarItemContainer } from "../../utils/styles";
import { UserAvatar } from "../users/UserAvatar";
import { getUserFriendInstance } from "../../utils/helpers";
import { IoMdCall, IoMdVideocam } from "react-icons/io";

type Props = {
  friend: Friend;
};

export const CallSidebarItem: FC<Props> = ({ friend }) => {
  const iconSize = 32;
  const { user } = useContext(AuthContext);

  return (
    <CallSidebarItemContainer>
      <div>
        <UserAvatar user={getUserFriendInstance(user!, friend)} />
      </div>
      <div>
        <div>
          <span className="username">{user?.username}</span>
        </div>
        <div className="icons">
          <div className="icon">
            <IoMdVideocam size={iconSize} />
          </div>
          <div className="icon">
            <IoMdCall size={iconSize} />
          </div>
        </div>
      </div>
    </CallSidebarItemContainer>
  );
}