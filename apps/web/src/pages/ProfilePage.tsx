import { useAuth } from "../context/AuthContext";

export const ProfilePage = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div>
        <p className="text-sm font-medium text-gray-500">StudentOps</p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
          Profile
        </h1>

        <p className="mt-2 text-gray-600">
          Manage your StudentOps account information.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Personal Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your account information currently stored in StudentOps.
          </p>
        </div>

        <div className="grid gap-6 px-6 py-6 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-gray-500">Full Name</p>
            <p className="mt-1 text-gray-900">{fullName}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="mt-1 text-gray-900">{user.email}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Role</p>
            <p className="mt-1 text-gray-900">{user.role}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Department</p>

            <p className="mt-1 text-gray-900">
              {user.department
                ? `${user.department.name} (${user.department.code})`
                : "Not assigned"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-red-200 bg-white">
        <div className="px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Account Actions
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Sign out of your StudentOps account.
          </p>

          <button
            type="button"
            onClick={logout}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
