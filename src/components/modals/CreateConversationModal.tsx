import { OverlayStyle } from "../../utils/styles";
import { CreateConversationForm } from "../forms/CreateConversationForm";
import { ModalContainer, ModalContentBody, ModalHeader } from "./Index";

export const CreateConversationModal = () => {
  return (
    <OverlayStyle>
      <ModalContainer>
        <ModalHeader>
          <h1>Create a Conversation</h1>
        </ModalHeader>
        <ModalContentBody>
          <CreateConversationForm />
        </ModalContentBody>
      </ModalContainer>
    </OverlayStyle>
  )
}