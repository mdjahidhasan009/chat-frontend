import styles from './index.module.scss';
import {ConversationType} from "../../utils/types";
import {Dispatch, FC, SetStateAction} from "react";
import {chatTypes} from "../../utils/constants";

type Props = {
  type: ConversationType;
  setType: Dispatch<SetStateAction<ConversationType>>;
}

export const ConversationTypeForm:FC<Props> = ({ type, setType}) => {
  return (
    <form className={styles.conversationTypeForm}>
      {chatTypes.map((chatType) => (
        <div>
          <input
            className={styles.radio}
            type="radio"
            name="conversationType"
            id={chatType.type}
            onChange={() => setType(chatType.type)}
            checked={type === chatType.type}
          />
          <label className={styles.radioLabel} htmlFor={chatType.type}>
            {chatType.label}
          </label>
        </div>
      ))}
    </form>
  );
};