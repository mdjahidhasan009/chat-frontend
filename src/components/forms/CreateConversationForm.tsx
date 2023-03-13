import { useDispatch } from "react-redux";
import {addConversation, createConversationThunk} from "../../store/conversationSlice";
import {
  Button,
  InputContainer,
  InputField,
  InputLabel,
  RecipientResultItem,
  TextField
} from "../../utils/styles";
import styles from './index.module.scss';
import React, {Dispatch, FC, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {ConversationType, CreateConversationParams, User} from "../../utils/types";
import {AppDispatch} from "../../store";
import { useNavigate } from 'react-router-dom';
import {useDebounce} from "../../utils/hooks/useDebounce";
import {searchUsers} from "../../utils/api";
import {SelectedRecipientChip} from "../recipients/SelectedRecipientChip";
import {createGroupThunk} from "../../store/groupSlice";
import {RecipientField} from "../recipients/RecipientField";
import {RecipientResultContainer} from "../recipients/RecipientResultContainer";

type Props = {
  setShowModal: Dispatch<React.SetStateAction<boolean>>;
  type: ConversationType;
};

export const CreateConversationForm: FC<Props> = ({ setShowModal, type }) => {
  const [query, setQuery] = useState('');
  const [userResults, setUserResults] = useState<User[]>([]);
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<User>();
  const [searching, setSearching] = useState(false);
  const [email, setEmail] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const debouncedQuery = useDebounce(query, 1000);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (debouncedQuery) {
      setSearching(true);
      searchUsers(debouncedQuery)
        .then(( { data }) => {
          setUserResults(data);
        })
        .catch((err) => console.log(err))
        .finally(() => setSearching(false));
    }
  }, [debouncedQuery]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message) return;
    if (type === 'private' && selectedUser)
    return dispatch(createConversationThunk({ email: selectedUser.email, message }))
      .unwrap()
      .then(({ data }) => {
        setShowModal(false);
        navigate(`conversations/${data.id}`);
      })
      .catch((err) => console.log(err));

    if (type === 'group' && selectedUsers.length > 0) {
      const users = selectedUsers.map((user) => user.email)
      return dispatch(createGroupThunk(users))
        .unwrap()
        .then(({ data }) => {
          setShowModal(false);
          navigate(`/groups/${data.id}`);
        })
        .catch((err) => console.log(err))
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setUserResults([]);
    setQuery('');
  };

  const handleMultipleUserSelect = (user: User) => {
    const exits = selectedUsers.find((u) => u.id === user.id);
    if (!exits) setSelectedUsers((prev) => [...prev, user]);
  };

  const removeAllSelectedUsers = () => {
    setQuery('');
    setUserResults([]);
    setSelectedUsers([]);
  };

  const saveResults = () => {
    setQuery('');
    setUserResults([]);
  };

  return (
    <form className={styles.createConversationForm} onSubmit={onSubmit}>
      <RecipientField
        selectedUser={selectedUser}
        selectedUsers={selectedUsers}
        setQuery={setQuery}
        setSelectedUser={setSelectedUser}
        setSelectedUsers={setSelectedUsers}
        type={type}
      />

      {!selectedUser && userResults.length > 0 && query && (
        <RecipientResultContainer
          type={type}
          userResults={userResults}
          handleUserSelect={handleUserSelect}
          handleMultipleUserSelect={handleMultipleUserSelect}
          removeAllSelectedUsers={removeAllSelectedUsers}
          saveResults={saveResults}
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
      <Button>Create Conversation</Button>
    </form>
  )
}