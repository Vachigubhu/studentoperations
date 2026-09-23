import type { ActivityType } from "../../api/request-activity";
import { useRequestActivity } from "../../hooks/useRequestActivity";

type RequestActivityTimelineProps = {
  requestId: string;
};

const activityIcon: Record<ActivityType, string> = {
  CREATED: "C",
  SUBMITTED: "S",
  STATUS_CHANGED: "↻",
  APPROVAL: "A",
  COMMENT: "C",
  DOCUMENT: "D",
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString();
};

export const RequestActivityTimeline = ({
  requestId,
}: RequestActivityTimelineProps) => {
  const activityQuery = useRequestActivity(requestId);

  if (activityQuery.isLoading) {
    return (
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Request Activity
        </h2>

        <p className="mt-4 text-sm text-gray-500">Loading activity...</p>
      </section>
    );
  }

  if (activityQuery.isError) {
    return (
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Request Activity
        </h2>

        <p className="mt-4 text-sm text-red-600">
          Failed to load request activity.
        </p>
      </section>
    );
  }

  const activities = activityQuery.data ?? [];

  return (
    <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Request Activity
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          A chronological history of activity on this request.
        </p>
      </div>

      {activities.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500">No activity recorded yet.</p>
      ) : (
        <div className="mt-6 space-y-6">
          {activities.map((activity, index) => (
            <div key={activity.id} className="relative flex gap-4">
              {index < activities.length - 1 && (
                <div className="absolute left-4 top-9 h-full w-px bg-gray-200" />
              )}

              <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-xs font-semibold text-gray-700">
                {activityIcon[activity.type]}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col justify-between gap-1 sm:flex-row">
                  <h3 className="font-medium text-gray-900">
                    {activity.title}
                  </h3>

                  <time className="text-xs text-gray-400">
                    {formatDate(activity.createdAt)}
                  </time>
                </div>

                {activity.description && (
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                    {activity.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
