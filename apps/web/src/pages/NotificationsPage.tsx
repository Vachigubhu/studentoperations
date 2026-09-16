import {
  useNotifications,
  useMarkNotificationAsRead,
} from "../hooks/useNotifications";

export const NotificationsPage = () => {
  const { data: notifications, isLoading, isError } = useNotifications();

  const markAsRead = useMarkNotificationAsRead();

  if (isLoading) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>

        <div className="mt-6 rounded-xl border bg-white p-6">
          Loading notifications...
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>

        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          Failed to load notifications.
        </div>
      </section>
    );
  }

  const unreadCount =
    notifications?.filter((notification) => !notification.isRead).length ?? 0;

  return (
    <section className="mx-auto max-w-4xl space-y-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>

        <p className="mt-2 text-gray-600">
          Stay updated on important StudentOps activity.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{unreadCount} unread</p>
      </div>

      {!notifications?.length ? (
        <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
          <p className="font-medium text-gray-900">No notifications</p>

          <p className="mt-1 text-sm text-gray-500">You're all caught up.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`px-6 py-5 ${
                  notification.isRead ? "bg-white" : "bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {!notification.isRead && (
                        <span className="h-2 w-2 rounded-full bg-gray-900" />
                      )}

                      <h2 className="font-semibold text-gray-900">
                        {notification.title}
                      </h2>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {notification.message}
                    </p>

                    <p className="mt-2 text-xs text-gray-400">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {!notification.isRead && (
                    <button
                      type="button"
                      onClick={() =>
                        void markAsRead.mutateAsync(notification._id)
                      }
                      disabled={markAsRead.isPending}
                      className="shrink-0 rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-white disabled:opacity-50"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
