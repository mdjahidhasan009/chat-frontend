import { MessageInput, MessageInputContainer } from "../../utils/styles";
import React, {Dispatch, FC, SetStateAction} from "react";
import styles from './index.module.scss';

type Props = {
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
  sendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const MessageInputField: FC<Props> = ({
  content,
  setContent,
  sendMessage
}) => {
  return (
    <MessageInputContainer>
      <form onSubmit={sendMessage} className={styles.form}>
        <MessageInput
          value={content}
          onChange={(e)=> setContent(e.target.value)}
        />
      </form>

    </MessageInputContainer>
  )
};