import { Conversation, User } from "./types";

export const getRecipientFromConversation = (
    conversation: Conversation | undefined,
    user?: User
) => {
  if(!conversation) return;
  return user?.id === conversation.creator.id
    ? conversation.recipient
    : conversation.creator;
}