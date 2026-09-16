import { useAuth } from "../context/AuthContext";

export const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div>
        <p className="text-sm font-medium text-gray-500">Overview</p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
          Welcome back, {user?.firstName}
        </h1>

        <p className="mt-2 text-gray-600">
          Here's what's happening with your StudentOps account.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">Role</p>

          <p className="mt-2 text-xl font-semibold text-gray-900">
            {user?.role}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">Requests</p>

          <p className="mt-2 text-3xl font-bold text-gray-900">—</p>

          <p className="mt-1 text-xs text-gray-500">Coming from API</p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">Notifications</p>

          <p className="mt-2 text-3xl font-bold text-gray-900">—</p>

          <p className="mt-1 text-xs text-gray-500">Coming from API</p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">Messages</p>

          <p className="mt-2 text-3xl font-bold text-gray-900">—</p>

          <p className="mt-1 text-xs text-gray-500">Coming from API</p>
        </div>
      </div>
    </div>
  );
};
