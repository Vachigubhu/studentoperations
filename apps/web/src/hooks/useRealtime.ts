import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { connectSocket } from "../socket/socket";

export const useRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = connectSocket();

    if (!socket) {
      return;
    }

    const handleNewMessage = () => {
      void queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    };

    const handleNewNotification = () => {
      void queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    };

    socket.on("message:new", handleNewMessage);

    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("notification:new", handleNewNotification);
    };
  }, [queryClient]);
};
