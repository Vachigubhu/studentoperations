import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { RoleRoute } from "../routes/RoleRoute";
import type { UserRole } from "../types/auth";

const mockUseAuth = vi.fn();

vi.mock("../context/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

const TestPage = ({ text }: { text: string }) => <div>{text}</div>;

const renderRoleRoute = (role: UserRole, allowedRoles: UserRole[]) => {
  mockUseAuth.mockReturnValue({
    user: {
      id: "user-1",
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      role,
    },
    isLoading: false,
    isAuthenticated: true,
  });

  return render(
    <MemoryRouter initialEntries={["/protected"]}>
      <Routes>
        <Route
          path="/protected"
          element={
            <RoleRoute allowedRoles={allowedRoles}>
              <TestPage text="Protected content" />
            </RoleRoute>
          }
        />

        <Route path="/login" element={<TestPage text="Login page" />} />

        <Route
          path="/dashboard"
          element={<TestPage text="Student dashboard" />}
        />

        <Route
          path="/staff/dashboard"
          element={<TestPage text="Staff dashboard" />}
        />

        <Route
          path="/manager/dashboard"
          element={<TestPage text="Manager dashboard" />}
        />

        <Route
          path="/admin/dashboard"
          element={<TestPage text="Admin dashboard" />}
        />
      </Routes>
    </MemoryRouter>,
  );
};

describe("RoleRoute", () => {
  it("renders protected content for an authorized role", () => {
    renderRoleRoute("STUDENT", ["STUDENT"]);

    expect(screen.getByText("Protected content")).toBeInTheDocument();
  });

  it("redirects an unauthenticated user to login", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <RoleRoute allowedRoles={["STUDENT"]}>
                <TestPage text="Protected content" />
              </RoleRoute>
            }
          />

          <Route path="/login" element={<TestPage text="Login page" />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Login page")).toBeInTheDocument();
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });

  it("shows loading while authentication is being restored", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: true,
      isAuthenticated: false,
    });

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <RoleRoute allowedRoles={["STUDENT"]}>
                <TestPage text="Protected content" />
              </RoleRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("redirects STAFF away from a STUDENT-only route", () => {
    renderRoleRoute("STAFF", ["STUDENT"]);

    expect(screen.getByText("Staff dashboard")).toBeInTheDocument();

    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });

  it("redirects MANAGER to the manager dashboard", () => {
    renderRoleRoute("MANAGER", ["STUDENT"]);

    expect(screen.getByText("Manager dashboard")).toBeInTheDocument();
  });

  it("redirects ADMIN to the admin dashboard", () => {
    renderRoleRoute("ADMIN", ["STUDENT"]);

    expect(screen.getByText("Admin dashboard")).toBeInTheDocument();
  });

  it("redirects SUPER_ADMIN to the admin dashboard", () => {
    renderRoleRoute("SUPER_ADMIN", ["STUDENT"]);

    expect(screen.getByText("Admin dashboard")).toBeInTheDocument();
  });
});
