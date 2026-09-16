import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getNotifications, markNotificationAsRead } from "../api/notifications";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationKeys.all, "list"] as const,
};

export const useNotifications = () => {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: getNotifications,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
};
