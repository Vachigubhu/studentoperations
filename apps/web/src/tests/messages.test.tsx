import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { MessagesPage } from "../pages/MessagePage";

const mockUseAuth = vi.fn();
const mockUseConversations = vi.fn();
const mockUseCreateConversation = vi.fn();
const mockUseMarkMessagesAsRead = vi.fn();
const mockUseMessages = vi.fn();
const mockUseSendMessage = vi.fn();
const mockUseUserDirectory = vi.fn();
const mockUseUnreadMessageCount = vi.fn();

vi.mock("../context/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("../hooks/useConversations", () => ({
  useConversations: () => mockUseConversations(),
  useCreateConversation: () => mockUseCreateConversation(),
  useMarkMessagesAsRead: () => mockUseMarkMessagesAsRead(),
  useMessages: (conversationId: string | null) =>
    mockUseMessages(conversationId),
  useSendMessage: () => mockUseSendMessage(),
  useUserDirectory: (search: string) => mockUseUserDirectory(search),
  useUnreadMessageCount: (conversationId: string) =>
    mockUseUnreadMessageCount(conversationId),
}));

const renderMessagesPage = () => render(<MessagesPage />);

const conversation = {
  _id: "conversation-1",
  subject: "Visa Extension Discussion",
  participants: [
    {
      _id: "user-2",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
    },
  ],
};

const defaultMocks = () => {
  mockUseAuth.mockReturnValue({
    user: {
      id: "user-1",
      firstName: "Trinity",
      lastName: "Chigubhu",
      email: "trinity@example.com",
      role: "STUDENT",
    },
  });

  mockUseConversations.mockReturnValue({
    data: [],
    isLoading: false,
    isError: false,
  });

  mockUseCreateConversation.mockReturnValue({
    mutateAsync: vi.fn(),
    isPending: false,
  });

  mockUseMarkMessagesAsRead.mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
  });

  mockUseMessages.mockReturnValue({
    data: {
      data: [],
    },
    isLoading: false,
  });

  mockUseSendMessage.mockReturnValue({
    mutateAsync: vi.fn(),
    isPending: false,
  });

  mockUseUserDirectory.mockReturnValue({
    data: [],
    isLoading: false,
  });

  mockUseUnreadMessageCount.mockReturnValue({
    data: 0,
  });
};

describe("MessagesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    defaultMocks();
  });

  it("renders the messages page", () => {
    renderMessagesPage();

    expect(
      screen.getByRole("heading", { name: "Messages" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Communicate with students and staff."),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "New Conversation" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Conversations")).toBeInTheDocument();
  });

  it("shows the loading state while conversations are loading", () => {
    mockUseConversations.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    renderMessagesPage();

    expect(screen.getByText("Loading conversations...")).toBeInTheDocument();
  });

  it("shows the API error state", () => {
    mockUseConversations.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    renderMessagesPage();

    expect(
      screen.getByText("Failed to load conversations."),
    ).toBeInTheDocument();
  });

  it("shows the empty conversation state", () => {
    renderMessagesPage();

    expect(screen.getByText("No conversations yet.")).toBeInTheDocument();

    expect(screen.getByText("Select a conversation")).toBeInTheDocument();
  });

  it("renders conversations and unread counts", () => {
    mockUseConversations.mockReturnValue({
      data: [
        conversation,
        {
          ...conversation,
          _id: "conversation-2",
          subject: "Fee Issue",
        },
      ],
      isLoading: false,
      isError: false,
    });

    mockUseUnreadMessageCount.mockImplementation((conversationId: string) => ({
      data: conversationId === "conversation-1" ? 3 : 0,
    }));

    renderMessagesPage();

    expect(screen.getAllByText("Visa Extension Discussion")).toHaveLength(2);

    expect(screen.getByText("Fee Issue")).toBeInTheDocument();

    expect(screen.getAllByText("John Doe")).toHaveLength(3);

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("selects a conversation and loads its messages", async () => {
    const user = userEvent.setup();

    mockUseConversations.mockReturnValue({
      data: [conversation],
      isLoading: false,
      isError: false,
    });

    mockUseMessages.mockReturnValue({
      data: {
        data: [
          {
            _id: "message-1",
            conversation: "conversation-1",
            sender: {
              _id: "user-2",
              firstName: "John",
              lastName: "Doe",
            },
            body: "Hello Trinity",
            createdAt: "2026-09-24T10:00:00.000Z",
          },
          {
            _id: "message-2",
            conversation: "conversation-1",
            sender: "user-1",
            body: "Hello John",
            createdAt: "2026-09-24T10:01:00.000Z",
          },
        ],
      },
      isLoading: false,
    });

    renderMessagesPage();

    await user.click(
      screen.getByRole("button", {
        name: /Visa Extension Discussion/,
      }),
    );

    expect(screen.getByText("Hello Trinity")).toBeInTheDocument();

    expect(screen.getByText("Hello John")).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Write a message..."),
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
  });

  it("marks the selected conversation as read", () => {
    const markRead = vi.fn();

    mockUseConversations.mockReturnValue({
      data: [conversation],
      isLoading: false,
      isError: false,
    });

    mockUseMarkMessagesAsRead.mockReturnValue({
      mutate: markRead,
      isPending: false,
    });

    renderMessagesPage();

    expect(markRead).toHaveBeenCalledWith("conversation-1");
  });

  it("sends a message", async () => {
    const user = userEvent.setup();
    const sendMessage = vi.fn().mockResolvedValue(undefined);

    mockUseConversations.mockReturnValue({
      data: [conversation],
      isLoading: false,
      isError: false,
    });

    mockUseSendMessage.mockReturnValue({
      mutateAsync: sendMessage,
      isPending: false,
    });

    renderMessagesPage();

    const textarea = screen.getByPlaceholderText("Write a message...");

    await user.type(textarea, "Hello John");

    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(sendMessage).toHaveBeenCalledWith({
      conversationId: "conversation-1",
      body: "Hello John",
    });

    expect(textarea).toHaveValue("");
  });

  it("does not send an empty message", async () => {
    const user = userEvent.setup();
    const sendMessage = vi.fn();

    mockUseConversations.mockReturnValue({
      data: [conversation],
      isLoading: false,
      isError: false,
    });

    mockUseSendMessage.mockReturnValue({
      mutateAsync: sendMessage,
      isPending: false,
    });

    renderMessagesPage();

    const sendButton = screen.getByRole("button", { name: "Send" });

    expect(sendButton).toBeDisabled();

    await user.click(sendButton);

    expect(sendMessage).not.toHaveBeenCalled();
  });

  it("opens the new conversation modal", async () => {
    const user = userEvent.setup();

    renderMessagesPage();

    await user.click(
      screen.getByRole("button", {
        name: "New Conversation",
      }),
    );

    expect(
      screen.getByRole("heading", {
        name: "New Conversation",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Search by name or email..."),
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Conversation subject"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Cancel",
      }),
    ).toBeInTheDocument();
  });

  it("searches for a participant and selects them", async () => {
    const user = userEvent.setup();

    mockUseUserDirectory.mockReturnValue({
      data: [
        {
          _id: "user-3",
          firstName: "Jane",
          lastName: "Smith",
          email: "jane@example.com",
        },
      ],
      isLoading: false,
    });

    renderMessagesPage();

    await user.click(
      screen.getByRole("button", {
        name: "New Conversation",
      }),
    );

    const searchInput = screen.getByPlaceholderText(
      "Search by name or email...",
    );

    await user.type(searchInput, "jane");

    expect(screen.getByText("Jane Smith")).toBeInTheDocument();

    expect(screen.getByText("jane@example.com")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: /Jane Smith/,
      }),
    );

    expect(searchInput).toHaveValue("Jane Smith");
  });

  it("creates a new conversation", async () => {
    const user = userEvent.setup();
    const createConversation = vi.fn().mockResolvedValue({
      _id: "conversation-new",
      subject: "Admission Question",
      participants: [
        {
          _id: "user-3",
          firstName: "Jane",
          lastName: "Smith",
          email: "jane@example.com",
        },
      ],
    });

    mockUseCreateConversation.mockReturnValue({
      mutateAsync: createConversation,
      isPending: false,
    });

    mockUseUserDirectory.mockReturnValue({
      data: [
        {
          _id: "user-3",
          firstName: "Jane",
          lastName: "Smith",
          email: "jane@example.com",
        },
      ],
      isLoading: false,
    });

    renderMessagesPage();

    await user.click(
      screen.getByRole("button", {
        name: "New Conversation",
      }),
    );

    await user.type(
      screen.getByPlaceholderText("Search by name or email..."),
      "jane",
    );

    await user.click(
      screen.getByRole("button", {
        name: /Jane Smith/,
      }),
    );

    await user.type(
      screen.getByPlaceholderText("Conversation subject"),
      "Admission Question",
    );

    await user.click(
      screen.getByRole("button", {
        name: "Start Conversation",
      }),
    );

    expect(createConversation).toHaveBeenCalledWith({
      participantId: "user-3",
      subject: "Admission Question",
    });
  });

  it("closes the new conversation modal", async () => {
    const user = userEvent.setup();

    renderMessagesPage();

    await user.click(
      screen.getByRole("button", {
        name: "New Conversation",
      }),
    );

    expect(
      screen.getByRole("heading", {
        name: "New Conversation",
      }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Cancel",
      }),
    );

    expect(
      screen.queryByRole("heading", {
        name: "New Conversation",
      }),
    ).not.toBeInTheDocument();
  });
});
