import { useDispatch } from "react-redux";
import {addConversation, createConversationThunk} from "../../store/conversationSlice";
import {Button, InputContainer, InputField, InputLabel, TextField} from "../../utils/styles";
import styles from './index.module.scss';
import {Dispatch, FC} from "react";
import {useForm} from "react-hook-form";
import {CreateConversationParams} from "../../utils/types";
import {AppDispatch} from "../../store";
type Props = {
  setShowModal: Dispatch<React.SetStateAction<boolean>>;
};
export const CreateConversationForm: FC<Props> = ({ setShowModal }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateConversationParams>({});
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = (data: CreateConversationParams) => {
    console.log(data);
    dispatch(createConversationThunk(data))
      .then((data) => {
        console.log(data);
        console.log('done');
        setShowModal(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <form className={styles.createConversationForm} onSubmit={handleSubmit(onSubmit)}>
      <section>
        <InputContainer backgroundColor="#161616">
          <InputLabel>Recipient</InputLabel>
          <InputField {...register('email', { required: 'Email is required' })}/>
        </InputContainer>
      </section>
      <section className={styles.message}>
        <InputContainer backgroundColor="#161616">
          <InputLabel>Message (optional)</InputLabel>
          <TextField {...register('message', { required: 'Message is required' })} />
        </InputContainer>
      </section>
      <Button>Create Conversation</Button>
    </form>
  )
}