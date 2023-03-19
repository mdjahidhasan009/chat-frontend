import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { MessageInputContainer } from '../../utils/styles';
import { MessageTextField } from '../inputs/MessageTextField';
import styles from './index.module.scss';
import { CirclePlusFill, FaceVeryHappy } from 'akar-icons';

type Props = {
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
  sendMessage: () => void;
  sendTypingStatus: () => void;
  placeholderName: string;
};

export const MessageInputField: FC<Props> = ({ content, setContent, sendMessage, sendTypingStatus, placeholderName }) => {
  const ICON_SIZE = 36;
  const MAX_LENGTH = 2048;
  const [isMultiLine, setIsMultiLine] = useState(false);
  const atMaxLength = content.length >= MAX_LENGTH;
  const updateContent = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setContent(e.target.value);

  return (
    <>
      <MessageInputContainer isMultiLine={isMultiLine}>
      <CirclePlusFill className={styles.icon} size={ICON_SIZE} />
        <form onSubmit={sendMessage} className={styles.form}>
          {/* <MessageInput
            value={content}
            onChange={updateContent}
            onKeyDown={sendTypingStatus}
            placeholder={`Send a message to ${placeholderName}`}
          /> */}
          <MessageTextField 
            message={content}
            setMessage={setContent}
            maxLength={MAX_LENGTH}
            setIsMultiLine={setIsMultiLine}
            sendTypingStatus={sendTypingStatus}
            sendMessage={sendMessage}
          />
        </form>
      </MessageInputContainer>
    </>
  );
};