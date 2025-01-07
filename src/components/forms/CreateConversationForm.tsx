import { useDispatch } from "react-redux";
import { createConversationThunk } from "../../store/conversationSlice";
import {
  Button,
  InputContainer,
  InputLabel,
  TextField
} from "../../utils/styles";
import styles from './index.module.scss';
import React, {Dispatch, FC, useEffect, useState} from "react";
import {User} from "../../utils/types";
import {AppDispatch} from "../../store";
import { useNavigate } from 'react-router-dom';
import {useDebounce} from "../../utils/hooks/useDebounce";
import {searchUsers} from "../../utils/api";
import {RecipientField} from "../recipients/RecipientField";
import {RecipientResultContainer} from "../recipients/RecipientResultContainer";
import Loader from "../ui/Loader";

type Props = {
  setShowModal: Dispatch<React.SetStateAction<boolean>>;
};

export const CreateConversationForm: FC<Props> = ({ setShowModal }) => {
  const [query, setQuery] = useState('');
  const [userResults, setUserResults] = useState<User[]>([]);
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<User>();
  const [conversationCreating, setConversationCreating] = useState(false);
  // const [searching, setSearching] = useState(false);

  const debouncedQuery = useDebounce(query, 1000);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (debouncedQuery) {
      // setSearching(true);
      searchUsers(debouncedQuery)
        .then(( { data }) => {
          setUserResults(data);
        })
        .catch((err) => console.log(err))
        // .finally(() => setSearching(false));
    }
  }, [debouncedQuery]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message || !selectedUser) return;

    setConversationCreating(true);
    return dispatch(
      createConversationThunk({ username: selectedUser.username, message })
    )
      .unwrap()
      .then(({ data }) => {
        setShowModal(false);
        navigate(`/conversations/${data.id}`);
      })
      .catch((err) => console.log(err))
      .finally(() => setConversationCreating(false));
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setUserResults([]);
    setQuery('');
  };

  return (
    <form className={styles.createConversationForm} onSubmit={onSubmit}>
      <RecipientField
        selectedUser={selectedUser}
        setQuery={setQuery}
        setSelectedUser={setSelectedUser}
      />

      {!selectedUser && userResults.length > 0 && query && (
        <RecipientResultContainer
          userResults={userResults}
          handleUserSelect={handleUserSelect}
        />
      )}

      <section className={styles.message}>
        <InputContainer backgroundColor="#161616">
          <InputLabel>Message (optional)</InputLabel>
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </InputContainer>
      </section>
      <Button
        type="submit"
        disabled={!selectedUser || conversationCreating}
      >
        {conversationCreating ? <Loader /> : ''}
        Create Conversation
      </Button>
    </form>
  )
}