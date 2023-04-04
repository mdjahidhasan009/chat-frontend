import React, { useState } from 'react';
import {
  Button,
  InputContainer,
  InputField,
  InputLabel,
} from '../../utils/styles';
import styles from './index.module.scss';
import {useParams} from "react-router-dom";
import {useToast} from "../../utils/hooks/useToast";
import {addGroupRecipient} from "../../utils/api";

export const GroupRecipientAddForm = () => {
  const { id: groupId } = useParams();
  const [username, setUsername] = useState('');
  const { success, error } = useToast({ theme: 'dark' });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addGroupRecipient({ id: parseInt(groupId!), username })
      .then(({ data }) => {
        success('Recipient Added to Group');
        setUsername('');
      })
      .catch((err) => {
        error('Failed to add user');
      });
  };

  return (
    <form className={styles.createConversationForm} onSubmit={onSubmit}>
      <InputContainer backgroundColor="#161616">
        <InputLabel>Recipient</InputLabel>
        <InputField onChange={(e) => setUsername(e.target.value)} />
      </InputContainer>
      <Button style={{ margin: '10px 0' }} disabled={!username}>
        Add Recipient
      </Button>
    </form>
  );
};