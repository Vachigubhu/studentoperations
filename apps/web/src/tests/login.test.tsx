import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { LoginPage } from "../pages/LoginPage";

const mockLogin = vi.fn();

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

const renderLoginPage = () => {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  );
};

describe("LoginPage", () => {
  beforeEach(() => {
    mockLogin.mockReset();
  });

  it("renders the login form", () => {
    renderLoginPage();

    expect(
      screen.getByRole("heading", {
        name: "Sign in to StudentOps",
      }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("allows the user to enter their credentials", async () => {
    const user = userEvent.setup();

    renderLoginPage();

    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Password");

    await user.type(email, "student@test.com");
    await user.type(password, "StudentTest123!");

    expect(email).toHaveValue("student@test.com");
    expect(password).toHaveValue("StudentTest123!");
  });

  it("calls login with the submitted credentials", async () => {
    const user = userEvent.setup();

    mockLogin.mockResolvedValue(undefined);

    renderLoginPage();

    await user.type(screen.getByLabelText("Email"), "student@test.com");

    await user.type(screen.getByLabelText("Password"), "StudentTest123!");

    await user.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        "student@test.com",
        "StudentTest123!",
      );
    });
  });

  it("shows validation errors when credentials are missing", async () => {
    const user = userEvent.setup();

    renderLoginPage();

    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(mockLogin).not.toHaveBeenCalled();

    expect(
      await screen.findByText("Invalid email address"),
    ).toBeInTheDocument();

    expect(
      await screen.findByText(
        /Too small: expected string to have >=1 characters/i,
      ),
    ).toBeInTheDocument();
  });

  it("shows an error when login fails", async () => {
    const user = userEvent.setup();

    mockLogin.mockRejectedValue(new Error("Invalid credentials"));

    renderLoginPage();

    await user.type(screen.getByLabelText("Email"), "student@test.com");

    await user.type(screen.getByLabelText("Password"), "WrongPassword123!");

    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(
      await screen.findByText("Invalid email or password."),
    ).toBeInTheDocument();
  });
});
