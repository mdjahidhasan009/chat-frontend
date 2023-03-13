import {ConversationType, User} from "../../utils/types";
import {Dispatch, FC, SetStateAction} from "react";
import {InputContainer, InputField, InputLabel, RecipientChipContainer} from "../../utils/styles";
import {SelectedRecipientChip} from "./SelectedRecipientChip";

type Props = {
  selectedUser: User | undefined;
  selectedUsers: User[];
  setQuery: Dispatch<SetStateAction<string>>;
  setSelectedUser: Dispatch<SetStateAction<User | undefined>>;
  setSelectedUsers: Dispatch<SetStateAction<User[]>>;
  type: ConversationType;
};

export const RecipientField: FC<Props> = ({
  selectedUser,
  selectedUsers,
  setQuery,
  setSelectedUser,
  setSelectedUsers,
  type,
}) => {
  const renderRecipients = () => {
    if (!selectedUser && selectedUsers.length === 0)
      return <InputField onChange={(e) => setQuery(e.target.value)}/>

    if (type === 'private' && selectedUser)
      return (
        <SelectedRecipientChip
          user={selectedUser}
          setSelectedUser={setSelectedUser}
          setSelectedUsers={setSelectedUsers}
          type={type}
        />
      );

    return selectedUsers.map((user) => (
      <SelectedRecipientChip
        user={user}
        setSelectedUser={setSelectedUser}
        setSelectedUsers={setSelectedUsers}
        type={type}
      />
    ));
  };

  return (
    <section>
      <InputContainer backgroundColor='#161616'>
        <InputLabel>Recipient</InputLabel>
        <RecipientChipContainer>{renderRecipients()}</RecipientChipContainer>
      </InputContainer>
    </section>
  )

};