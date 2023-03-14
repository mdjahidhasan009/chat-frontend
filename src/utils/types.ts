import { Message } from 'react-hook-form';

export type CreateUserParams = {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    messages: MessageType[];
};

export type UserCredentialsParams = {
    email: string;
    password: string;
};

export type User = {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
};

export type Conversation = {
    id: number;
    creator: User;
    recipient: User;
    createdAt: string;
    lastMessageSent: MessageType;
};

export type CreateConversationParams = {
    email: string;
    message: string;
};

export type MessageType = {
    id: number;
    content: string;
    createdAt: string;
    author: User;
    conversation: Conversation;
};

export type GroupMessageType = {
    id: number;
    content: string;
    createdAt: string;
    author: User;
    group: Group;
};

export type FetchMessagePayload = {
    id: number;
    messages: MessageType[];
};

export type FetchGroupMessagePayload = {
    id: number;
    messages: GroupMessageType[];
};

export type MessageEventPayload = {
    message: MessageType;
    conversation: Conversation;
};

export type CreateMessageParams = {
    id: number;
    content: string;
};

export type ConversationMessage = {
    id: number;
    messages: MessageType[];
};

export type GroupMessage = {
    id: number;
    messages: GroupMessageType[];
};

export type DeleteMessageParams = {
    id: number;
    messageId: number;
};

export type DeleteGroupMessageParams = {
    id: number;
    messageId: number;
};

export type DeleteMessageResponse = {
    conversationId: number;
    messageId: number;
};

export type DeleteGroupMessageResponse = {
    groupId: number;
    messageId: number;
};

export type MessagePanelProps = {
    isTyping: boolean;
}

export type EditMessagePayload = {
    conversationId: number;
    messageId: number;
    content: string;
};

export type ConversationType = 'group' | 'private';

export type ConversationTypeData = {
    type: ConversationType;
    label: string;
};

export type Group = {
    id: number;
    title?: string;
    users: User[];
    creator: User;
    messages: MessageType[];
    createdAt: number;
    lastMessageSent: MessageType;
    lastMessageSentAt: Date;
};

export type GroupMessageEventPayload = {
    message: GroupMessageType;
    group: Group;
};

export type CreateGroupParams = {
    users: string[];
    title: string;
};