import {InputContainer, InputField} from "../../utils/styles";
import styles from './index.module.scss';
export const CreateConversationForm = () => {
  return (
    <form className={styles.createConversationForm}>
      <InputContainer>
        <InputField />
      </InputContainer>
    </form>
  )
}