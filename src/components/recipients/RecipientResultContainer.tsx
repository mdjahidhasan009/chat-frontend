import {ConversationType, User} from "../../utils/types";
import {FC} from "react";
import {
  RecipientBottomSection,
  RecipientResultContainerStyle,
  RecipientResultItem,
  RecipientScrollableItemContainer
} from "../../utils/styles";
import {type} from "os";

type Props = {
  userResults: User[];
  handleUserSelect: (user: User) => void;
};

export const RecipientResultContainer: FC<Props> = ({
  userResults,
  handleUserSelect,
}) => {
  return (
    <RecipientResultContainerStyle>
      <RecipientScrollableItemContainer>
        {userResults.map((user) => (
          <RecipientResultItem
            key={user.id}
            onClick={() => handleUserSelect(user)}
          >
            <span>{user.username}</span>
          </RecipientResultItem>
        ))}
      </RecipientScrollableItemContainer>
    </RecipientResultContainerStyle>
  )
}