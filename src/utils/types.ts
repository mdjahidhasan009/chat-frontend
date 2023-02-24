export type CreateUserParams = {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
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

export type ConversationType = {
    id: number;
    creator: User;
    recipient: User;
    createdAt: Date;
    messages: MessageType[];
};

export type CreateConversationParams = {
    recipient: string;
};

export type FetchMessagePayload = {
    id: number;
    messages: MessageType[];
};

export type MessageType = {
    id: number;
    content: string;
    createdAt: string;
    author: User;
}

export type MessageEventPayload = {
    id: number;
    createdAt: string;
    conversation: ConversationType;
    author: User;
    content: string;
}

export type ConversationMessage = {
    id: number;
    messages: MessageType[];
};

export type CreateMessageParams = {
    content: string;
    conversationId: number;
}

export type Conversation = {
    id: number;
    messages: MessageType[];
}