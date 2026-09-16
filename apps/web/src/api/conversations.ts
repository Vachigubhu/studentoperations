import { api } from "./client";

export type ConversationParticipant = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

export type DirectoryUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: {
    _id: string;
    name: string;
    code: string;
  } | null;
};

export type Conversation = {
  _id: string;
  participants: ConversationParticipant[];
  request?: string | null;
  subject: string;
  lastMessageAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ConversationsResponse = {
  data: Conversation[];
};

export type CreateConversationInput = {
  participantId: string;
  requestId?: string;
  subject: string;
};

export type MessageSender = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

export type Message = {
  _id: string;
  conversation: string;
  sender: MessageSender | string;
  body: string;
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MessagesResponse = {
  data: Message[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const getConversations = async () => {
  const response = await api.get<ConversationsResponse>("/conversations");

  return response.data.data;
};

export const createConversation = async (input: CreateConversationInput) => {
  const response = await api.post<{
    data: Conversation;
  }>("/conversations", input);

  return response.data.data;
};

export const getMessages = async (conversationId: string) => {
  const response = await api.get<MessagesResponse>(
    `/conversations/${conversationId}/messages`,
  );

  return response.data;
};

export const sendMessage = async (conversationId: string, body: string) => {
  const response = await api.post<{
    data: Message;
  }>(`/conversations/${conversationId}/messages`, { body });

  return response.data.data;
};

export const markMessagesAsRead = async (conversationId: string) => {
  await api.patch(`/conversations/${conversationId}/messages/read`);
};

export const getUnreadMessageCount = async (conversationId: string) => {
  const response = await api.get<{
    data: {
      unreadCount: number;
    };
  }>(`/conversations/${conversationId}/messages/unread-count`);

  return response.data.data.unreadCount;
};

export const getUserDirectory = async (search = "") => {
  const response = await api.get<{
    status: string;
    data: {
      users: DirectoryUser[];
    };
  }>("/users/directory", {
    params: search ? { search } : undefined,
  });

  return response.data.data.users;
};

export const getTotalUnreadMessageCount = async () => {
  const response = await api.get<{
    status: string;
    data: {
      count: number;
    };
  }>("/conversations/unread-count");

  return response.data.data.count;
};