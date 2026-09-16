import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createConversation,
  getConversations,
  getMessages,
  getUnreadMessageCount,
  markMessagesAsRead,
  sendMessage,
  type CreateConversationInput,
  type DirectoryUser,
  getUserDirectory,
  getTotalUnreadMessageCount,
} from "../api/conversations";

export const conversationKeys = {
  all: ["conversations"] as const,

  list: () => [...conversationKeys.all, "list"] as const,

  messages: (conversationId: string) =>
    [...conversationKeys.all, "messages", conversationId] as const,

  unread: (conversationId: string) =>
    [...conversationKeys.all, "unread", conversationId] as const,
};

export const useConversations = () => {
  return useQuery({
    queryKey: conversationKeys.list(),
    queryFn: getConversations,
  });
};

export const useMessages = (conversationId: string | null) => {
  return useQuery({
    queryKey: conversationKeys.messages(conversationId ?? ""),
    queryFn: () => getMessages(conversationId as string),
    enabled: Boolean(conversationId),
  });
};

export const useUnreadMessageCount = (conversationId: string) => {
  return useQuery({
    queryKey: conversationKeys.unread(conversationId),
    queryFn: () => getUnreadMessageCount(conversationId),
    enabled: Boolean(conversationId),
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateConversationInput) => createConversation(input),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: conversationKeys.list(),
      });
    },
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      body,
    }: {
      conversationId: string;
      body: string;
    }) => sendMessage(conversationId, body),

    onSuccess: (message) => {
      void queryClient.invalidateQueries({
        queryKey: conversationKeys.messages(message.conversation),
      });

      void queryClient.invalidateQueries({
        queryKey: conversationKeys.list(),
      });
    },
  });
};

export const useMarkMessagesAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => markMessagesAsRead(conversationId),

    onSuccess: (_, conversationId) => {
      void queryClient.invalidateQueries({
        queryKey: conversationKeys.unread(conversationId),
      });

      void queryClient.invalidateQueries({
        queryKey: conversationKeys.messages(conversationId),
      });

      void queryClient.invalidateQueries({
        queryKey: ["conversations", "unread-count"],
      });
    },
  });
};

export const useUserDirectory = (search: string) => {
  return useQuery<DirectoryUser[]>({
    queryKey: ["users", "directory", search],
    queryFn: () => getUserDirectory(search),
    enabled: search.trim().length >= 2,
  });
};

export const useTotalUnreadMessageCount = () => {
  return useQuery({
    queryKey: ["conversations", "unread-count"],
    queryFn: getTotalUnreadMessageCount,
    refetchInterval: 30_000,
  });
};
