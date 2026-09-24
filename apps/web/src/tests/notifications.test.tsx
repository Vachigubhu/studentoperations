import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { NotificationsPage } from "../pages/NotificationsPage";

const mockUseNotifications = vi.fn();
const mockMutateAsync = vi.fn();

vi.mock("../hooks/useNotifications", () => ({
  useNotifications: () => mockUseNotifications(),
  useMarkNotificationAsRead: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

describe("NotificationsPage", () => {
  beforeEach(() => {
    mockUseNotifications.mockReset();
    mockMutateAsync.mockReset();
  });

  it("renders the notifications page", () => {
    mockUseNotifications.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    render(<NotificationsPage />);

    expect(
      screen.getByRole("heading", { name: "Notifications" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Stay updated on important StudentOps activity."),
    ).toBeInTheDocument();
  });

  it("shows the loading state", () => {
    mockUseNotifications.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    render(<NotificationsPage />);

    expect(screen.getByText("Loading notifications...")).toBeInTheDocument();
  });

  it("shows the API error state", () => {
    mockUseNotifications.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    render(<NotificationsPage />);

    expect(
      screen.getByText("Failed to load notifications."),
    ).toBeInTheDocument();
  });

  it("shows the empty state", () => {
    mockUseNotifications.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    render(<NotificationsPage />);

    expect(screen.getByText("No notifications")).toBeInTheDocument();

    expect(screen.getByText("You're all caught up.")).toBeInTheDocument();

    expect(screen.getByText("0 unread")).toBeInTheDocument();
  });

  it("renders notifications and calculates unread count", () => {
    mockUseNotifications.mockReturnValue({
      data: [
        {
          _id: "notification-1",
          title: "Request submitted",
          message: "Your visa extension request was submitted.",
          type: "REQUEST_SUBMITTED",
          isRead: false,
          createdAt: "2026-09-24T10:00:00.000Z",
        },
        {
          _id: "notification-2",
          title: "Request approved",
          message: "Your request has been approved.",
          type: "APPROVAL_DECISION",
          isRead: true,
          createdAt: "2026-09-24T11:00:00.000Z",
        },
      ],
      isLoading: false,
      isError: false,
    });

    render(<NotificationsPage />);

    expect(screen.getByText("Request submitted")).toBeInTheDocument();

    expect(
      screen.getByText("Your visa extension request was submitted."),
    ).toBeInTheDocument();

    expect(screen.getByText("Request approved")).toBeInTheDocument();

    expect(screen.getByText("1 unread")).toBeInTheDocument();
  });

  it("shows Mark as read only for unread notifications", () => {
    mockUseNotifications.mockReturnValue({
      data: [
        {
          _id: "notification-1",
          title: "Unread notification",
          message: "This notification is unread.",
          type: "REQUEST_SUBMITTED",
          isRead: false,
          createdAt: "2026-09-24T10:00:00.000Z",
        },
        {
          _id: "notification-2",
          title: "Read notification",
          message: "This notification is already read.",
          type: "APPROVAL_DECISION",
          isRead: true,
          createdAt: "2026-09-24T11:00:00.000Z",
        },
      ],
      isLoading: false,
      isError: false,
    });

    render(<NotificationsPage />);

    expect(
      screen.getByRole("button", { name: "Mark as read" }),
    ).toBeInTheDocument();

    expect(
      screen.getAllByRole("button", { name: "Mark as read" }),
    ).toHaveLength(1);
  });

  it("marks an unread notification as read", async () => {
    const user = userEvent.setup();

    mockMutateAsync.mockResolvedValue(undefined);

    mockUseNotifications.mockReturnValue({
      data: [
        {
          _id: "notification-123",
          title: "New request",
          message: "A new request has been submitted.",
          type: "REQUEST_SUBMITTED",
          isRead: false,
          createdAt: "2026-09-24T10:00:00.000Z",
        },
      ],
      isLoading: false,
      isError: false,
    });

    render(<NotificationsPage />);

    await user.click(screen.getByRole("button", { name: "Mark as read" }));

    expect(mockMutateAsync).toHaveBeenCalledTimes(1);
    expect(mockMutateAsync).toHaveBeenCalledWith("notification-123");
  });
});
