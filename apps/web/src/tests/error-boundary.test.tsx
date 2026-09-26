import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { describe, it, expect, vi } from "vitest";

const BrokenComponent = () => {
  throw new Error("Test rendering failure");
};

describe("ErrorBoundary", () => {
  it("shows a safe fallback when a child throws", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>,
    );

    expect(
      screen.getByRole("heading", {
        name: "Something went wrong",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Try again",
      }),
    ).toBeInTheDocument();

    consoleError.mockRestore();
  });
});