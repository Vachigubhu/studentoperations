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

const HomeRedirect = () => {
  const { isAuthenticated } = useAuth();

  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

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
                <DashboardPage />
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
                <PlaceholderPage
                  title="Manager Requests"
                  description="Manage departmental requests and workflows."
                />
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
                <PlaceholderPage
                  title="Messages"
                  description="Real-time conversations and collaboration."
                />
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
                <PlaceholderPage
                  title="Notifications"
                  description="Stay updated on important StudentOps activity."
                />
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
