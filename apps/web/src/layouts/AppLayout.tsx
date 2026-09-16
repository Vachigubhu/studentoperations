import { Link, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import { Sidebar } from "../components/layout/Sidebar";

export const AppLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 border-b bg-white">
        <div className="flex h-18.5 items-center justify-between px-6">
          <Link
            to="/dashboard"
            className="text-xl font-bold tracking-tight text-gray-900"
          >
            StudentOps
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>

              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>

            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <Sidebar />

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
