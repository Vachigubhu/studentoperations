import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { deleteDocument, getDocuments, uploadDocument } from "../api/document";

export const documentKeys = {
  all: ["documents"] as const,

  list: (requestId: string) =>
    [...documentKeys.all, "list", requestId] as const,
};

export const useDocuments = (requestId: string) => {
  return useQuery({
    queryKey: documentKeys.list(requestId),
    queryFn: () => getDocuments(requestId),
    enabled: !!requestId,
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      file,
      category,
    }: {
      requestId: string;
      file: File;
      category: string;
    }) => uploadDocument(requestId, file, category),

    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: documentKeys.list(variables.requestId),
      });
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ documentId }: { documentId: string; requestId: string }) =>
      deleteDocument(documentId),

    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: documentKeys.list(variables.requestId),
      });
    },
  });
};
