import { User } from "../../utils/types";
import { Dispatch, FC, SetStateAction } from "react";
import { InputContainer, InputField, InputLabel } from "../../utils/styles";
import { SelectedRecipientChip } from "./SelectedRecipientChip";

type Props = {
  selectedUser: User | undefined;
  setQuery: Dispatch<SetStateAction<string>>;
  setSelectedUser: Dispatch<SetStateAction<User | undefined>>;
};

export const RecipientField: FC<Props> = ({
  selectedUser,
  setQuery,
  setSelectedUser,
                                          }) => (
  <section>
    <InputContainer backgroundColor="#161616">
      <InputLabel>Recipient</InputLabel>
      {selectedUser ? (
        <SelectedRecipientChip
          user={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      ) : (
        <InputField onChange={(e) => setQuery(e.target.value)} />
      )}
    </InputContainer>
  </section>
);