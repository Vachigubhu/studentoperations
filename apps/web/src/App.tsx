import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { AppLayout } from "./layouts/AppLayout";
import { RoleRoute } from "./routes/RoleRoute";
import { DashboardPage } from "./pages/DashboardPage";
import { StaffDashboardPage } from "./pages/StaffDashboardPage";
import { ManagerDashboardPage } from "./pages/ManagerDashboardPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { RequestsPage } from "./pages/RequestsPage";
import { NewRequestPage } from "./pages/NewRequestPage";
import { LoginPage } from "./pages/LoginPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { RequestDetailPage } from "./pages/RequestDetailPage";
import { StaffRequestsPage } from "./pages/StaffRequestsPage";
import { StaffRequestDetailPage } from "./pages/StaffRequestDetailPage";
import { ManagerRequestsPage } from "./pages/ManagerRequestsPage";
import { ManagerRequestDetailPage } from "./pages/ManagerRequestDetailPage";
import { AdminAuditLogsPage } from "./pages/AdminAuditLogsPage";
import { AdminUsersPage } from "./pages/AdminUsersPage";
import { AdminDepartmentsPage } from "./pages/AdminDepartmentsPage";
import { AdminRequestTypesPage } from "./pages/AdminRequestTypesPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { MessagesPage } from "./pages/MessagePage";

const HomeRedirect = () => {
  const { isAuthenticated } = useAuth();

  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

function RoleBasedDashboard() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  switch (user.role) {
    case "STAFF":
      return <StaffDashboardPage />;

    case "MANAGER":
      return <ManagerDashboardPage />;

    case "ADMIN":
    case "SUPER_ADMIN":
      return <AdminDashboardPage />;

    case "STUDENT":
    default:
      return <DashboardPage />;
  }
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />

        <Route path="/login" element={<LoginPage />} />

        {/* Protected application routes */}
        <Route element={<AppLayout />}>
          {/* General dashboard */}
          <Route
            path="/dashboard"
            element={
              <RoleRoute
                allowedRoles={[
                  "STUDENT",
                  "STAFF",
                  "MANAGER",
                  "ADMIN",
                  "SUPER_ADMIN",
                ]}
              >
                <RoleBasedDashboard />
              </RoleRoute>
            }
          />

          {/* Staff dashboard */}
          <Route
            path="/staff/dashboard"
            element={
              <RoleRoute allowedRoles={["STAFF"]}>
                <StaffDashboardPage />
              </RoleRoute>
            }
          />

          {/* Manager dashboard */}
          <Route
            path="/manager/dashboard"
            element={
              <RoleRoute allowedRoles={["MANAGER"]}>
                <ManagerDashboardPage />
              </RoleRoute>
            }
          />

          {/* Admin dashboard */}
          <Route
            path="/admin/dashboard"
            element={
              <RoleRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                <AdminDashboardPage />
              </RoleRoute>
            }
          />

          {/* Admin audit logs */}
          <Route
            path="/admin/audit-logs"
            element={
              <RoleRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                <AdminAuditLogsPage />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <RoleRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                <AdminUsersPage />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/departments"
            element={
              <RoleRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                <AdminDepartmentsPage />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/request-types"
            element={
              <RoleRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                <AdminRequestTypesPage />
              </RoleRoute>
            }
          />

          {/* Student requests */}
          <Route
            path="/requests"
            element={
              <RoleRoute allowedRoles={["STUDENT"]}>
                <RequestsPage />
              </RoleRoute>
            }
          />

          <Route
            path="/requests/new"
            element={
              <RoleRoute allowedRoles={["STUDENT"]}>
                <NewRequestPage />
              </RoleRoute>
            }
          />

          {/* Student request detail */}
          <Route
            path="/requests/:id"
            element={
              <RoleRoute allowedRoles={["STUDENT"]}>
                <RequestDetailPage />
              </RoleRoute>
            }
          />

          {/* Staff requests */}
          <Route
            path="/staff/requests"
            element={
              <RoleRoute allowedRoles={["STAFF"]}>
                <StaffRequestsPage />
              </RoleRoute>
            }
          />

          {/* Staff request detail */}
          <Route
            path="/staff/requests/:id"
            element={
              <RoleRoute allowedRoles={["STAFF"]}>
                <StaffRequestDetailPage />
              </RoleRoute>
            }
          />

          {/* Manager requests */}
          <Route
            path="/manager/requests"
            element={
              <RoleRoute allowedRoles={["MANAGER"]}>
                <ManagerRequestsPage />
              </RoleRoute>
            }
          />

          <Route
            path="/manager/requests/:id"
            element={
              <RoleRoute allowedRoles={["MANAGER"]}>
                <ManagerRequestDetailPage />
              </RoleRoute>
            }
          />

          {/* Messages */}
          <Route
            path="/messages"
            element={
              <RoleRoute
                allowedRoles={[
                  "STUDENT",
                  "STAFF",
                  "MANAGER",
                  "ADMIN",
                  "SUPER_ADMIN",
                ]}
              >
                <MessagesPage />
              </RoleRoute>
            }
          />

          {/* Notifications */}
          <Route
            path="/notifications"
            element={
              <RoleRoute
                allowedRoles={[
                  "STUDENT",
                  "STAFF",
                  "MANAGER",
                  "ADMIN",
                  "SUPER_ADMIN",
                ]}
              >
                <NotificationsPage />
              </RoleRoute>
            }
          />

          {/* Profile */}
          <Route
            path="/profile"
            element={
              <RoleRoute
                allowedRoles={[
                  "STUDENT",
                  "STAFF",
                  "MANAGER",
                  "ADMIN",
                  "SUPER_ADMIN",
                ]}
              >
                <PlaceholderPage
                  title="Profile"
                  description="Manage your StudentOps profile."
                />
              </RoleRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
