import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "../api/comments";

export const commentKeys = {
  all: ["comments"] as const,

  list: (requestId: string) => [...commentKeys.all, "list", requestId] as const,
};

export const useComments = (requestId: string) => {
  return useQuery({
    queryKey: commentKeys.list(requestId),
    queryFn: () => getComments(requestId),
    enabled: !!requestId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, body }: { requestId: string; body: string }) =>
      createComment(requestId, body),

    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: commentKeys.list(variables.requestId),
      });
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, body }: { commentId: string; body: string }) =>
      updateComment(commentId, body),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: commentKeys.all,
      });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId }: { commentId: string; requestId: string }) =>
      deleteComment(commentId),

    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: commentKeys.list(variables.requestId),
      });
    },
  });
};
