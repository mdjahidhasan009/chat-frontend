import { ConversationType, User } from "./types";

export const getRecipientFromConversation = (
    conversation: ConversationType | undefined,
    user?: User
) => {
  if(!conversation) return;
  return user?.id === conversation.creator.id
    ? conversation.recipient
    : conversation.creator;
}