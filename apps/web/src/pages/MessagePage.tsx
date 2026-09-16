import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { DirectoryUser, Conversation } from "../api/conversations";
import {
  useConversations,
  useCreateConversation,
  useMarkMessagesAsRead,
  useMessages,
  useSendMessage,
  useUserDirectory,
  useUnreadMessageCount,
} from "../hooks/useConversations";

export const MessagesPage = () => {
  const { user } = useAuth();

  const {
    data: conversations,
    isLoading: conversationsLoading,
    isError: conversationsError,
  } = useConversations();

  const createConversation = useCreateConversation();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [body, setBody] = useState("");

  const [showNewConversation, setShowNewConversation] = useState(false);
  const [participantSearch, setParticipantSearch] = useState("");
  const [selectedParticipant, setSelectedParticipant] =
    useState<DirectoryUser | null>(null);
  const [subject, setSubject] = useState("");

  const { data: directoryUsers = [], isLoading: isSearchingUsers } =
    useUserDirectory(participantSearch);

  const selectedConversation = useMemo(
    () =>
      conversations?.find((conversation) => conversation._id === selectedId),
    [conversations, selectedId],
  );

  const ConversationListItem = ({
    conversation,
    selected,
    onClick,
  }: {
    conversation: Conversation;
    selected: boolean;
    onClick: () => void;
  }) => {
    const { data: unreadCount = 0 } = useUnreadMessageCount(conversation._id);

    const otherParticipant = conversation.participants[0];

    return (
      <button
        type="button"
        onClick={onClick}
        className={`flex w-full items-center justify-between border-b border-gray-100 px-4 py-4 text-left ${
          selected ? "bg-gray-100" : "hover:bg-gray-50"
        }`}
      >
        <div className="min-w-0">
          <p className="truncate font-medium text-gray-900">
            {conversation.subject}
          </p>

          {otherParticipant && (
            <p className="mt-1 truncate text-sm text-gray-500">
              {otherParticipant.firstName} {otherParticipant.lastName}
            </p>
          )}
        </div>

        {unreadCount > 0 && (
          <span className="ml-3 flex h-6 min-w-6 items-center justify-center rounded-full bg-black px-2 text-xs font-semibold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
    );
  };

  useEffect(() => {
    if (!selectedId && conversations && conversations.length > 0) {
      setSelectedId(conversations[0]._id);
    }
  }, [conversations, selectedId]);

  const { data: messagesData, isLoading: messagesLoading } =
    useMessages(selectedId);

  const sendMessageMutation = useSendMessage();

  const markReadMutation = useMarkMessagesAsRead();

  useEffect(() => {
    if (selectedId) {
      markReadMutation.mutate(selectedId);
    }

    // We intentionally mark when the selected
    // conversation changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const messages = messagesData?.data ?? [];

  const getOtherParticipant = (
    conversation: NonNullable<typeof conversations>[number],
  ) => {
    return (
      conversation.participants.find(
        (participant) => participant._id !== user?.id,
      ) ?? conversation.participants[0]
    );
  };

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedBody = body.trim();

    if (!selectedId || !trimmedBody) {
      return;
    }

    await sendMessageMutation.mutateAsync({
      conversationId: selectedId,
      body: trimmedBody,
    });

    setBody("");
  };

  const handleCreateConversation = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedParticipant || !subject.trim()) {
      return;
    }

    const conversation = await createConversation.mutateAsync({
      participantId: selectedParticipant._id,
      subject: subject.trim(),
    });

    setShowNewConversation(false);
    setParticipantSearch("");
    setSelectedParticipant(null);
    setSubject("");

    setSelectedId(conversation._id);
  };

  const handleCloseNewConversation = () => {
    setShowNewConversation(false);
    setParticipantSearch("");
    setSelectedParticipant(null);
    setSubject("");
  };

  if (conversationsLoading) {
    return (
      <section
        className="mx-auto max-w-7xl px-6 py-10"
        style={{
          fontFamily:
            '"Roboto Variable", Roboto, "Helvetica Neue", Helvetica, sans-serif',
        }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>

        <div className="mt-6 rounded-xl border bg-white p-6">
          Loading conversations...
        </div>
      </section>
    );
  }

  if (conversationsError) {
    return (
      <section
        className="mx-auto max-w-7xl px-6 py-10"
        style={{
          fontFamily:
            '"Roboto Variable", Roboto, "Helvetica Neue", Helvetica, sans-serif',
        }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>

        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          Failed to load conversations.
        </div>
      </section>
    );
  }

  return (
    <section
      className="mx-auto max-w-7xl px-6 py-8"
      style={{
        fontFamily:
          '"Roboto Variable", Roboto, "Helvetica Neue", Helvetica, sans-serif',
        fontSize: "16px",
        fontWeight: 400,
        fontStyle: "normal",
        lineHeight: "16px",
        letterSpacing: "normal",
      }}
    >
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>

          <p className="mt-1 text-gray-500">
            Communicate with students and staff.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewConversation(true)}
          disabled={createConversation.isPending}
          className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          New Conversation
        </button>
      </div>

      {/* Main Messaging Interface */}
      <div className="grid min-h-162.5 overflow-hidden rounded-xl border bg-white shadow-sm lg:grid-cols-[320px_1fr]">
        {/* Conversations */}
        <aside className="border-b lg:border-b-0 lg:border-r">
          <div className="border-b px-5 py-4">
            <h2 className="font-semibold text-gray-900">Conversations</h2>
          </div>

          {!conversations?.length ? (
            <div className="p-6 text-center text-sm text-gray-500">
              No conversations yet.
            </div>
          ) : (
            <div className="divide-y">
              {conversations.map((conversation) => (
                <ConversationListItem
                  key={conversation._id}
                  conversation={conversation}
                  selected={selectedId === conversation._id}
                  onClick={() => setSelectedId(conversation._id)}
                />
              ))}
            </div>
          )}
        </aside>

        {/* Message Panel */}
        <div className="flex min-h-162.5 flex-col">
          {!selectedConversation ? (
            <div className="flex flex-1 items-center justify-center p-8 text-center">
              <div>
                <p className="font-medium text-gray-900">
                  Select a conversation
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Choose a conversation from the list to view messages.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Conversation Header */}
              <header className="border-b px-6 py-4">
                <h2 className="font-semibold text-gray-900">
                  {selectedConversation.subject}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {getOtherParticipant(selectedConversation)?.firstName ??
                    "Participant"}{" "}
                  {getOtherParticipant(selectedConversation)?.lastName ?? ""}
                </p>
              </header>

              {/* Messages */}
              <div className="flex-1 space-y-4 overflow-y-auto p-6">
                {messagesLoading ? (
                  <p className="text-center text-sm text-gray-500">
                    Loading messages...
                  </p>
                ) : messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-center">
                    <div>
                      <p className="font-medium text-gray-900">
                        No messages yet
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Start the conversation below.
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => {
                    const senderId =
                      typeof message.sender === "string"
                        ? message.sender
                        : message.sender._id;

                    const isMine = senderId === user?.id;

                    return (
                      <div
                        key={message._id}
                        className={`flex ${
                          isMine ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                            isMine
                              ? "bg-gray-900 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="whitespace-pre-wrap text-sm leading-6">
                            {message.body}
                          </p>

                          <time
                            className={`mt-1 block text-xs ${
                              isMine ? "text-gray-300" : "text-gray-400"
                            }`}
                          >
                            {new Date(message.createdAt).toLocaleString()}
                          </time>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Composer */}
              <form onSubmit={handleSend} className="border-t p-4">
                <div className="flex gap-3">
                  <textarea
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    placeholder="Write a message..."
                    rows={2}
                    maxLength={5000}
                    className="min-w-0 flex-1 resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500"
                  />

                  <button
                    type="submit"
                    disabled={sendMessageMutation.isPending || !body.trim()}
                    className="self-end rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {sendMessageMutation.isPending ? "Sending..." : "Send"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      {/* New Conversation Modal */}
      {showNewConversation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                New Conversation
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Select a student or staff member to start messaging.
              </p>
            </div>

            <form onSubmit={handleCreateConversation}>
              <div className="space-y-4">
                {/* Participant */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Participant
                  </label>

                  <input
                    type="text"
                    value={participantSearch}
                    onChange={(event) => {
                      setParticipantSearch(event.target.value);
                      setSelectedParticipant(null);
                    }}
                    placeholder="Search by name or email..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500"
                    autoFocus
                  />

                  {isSearchingUsers && (
                    <p className="mt-2 text-sm text-gray-500">Searching...</p>
                  )}

                  {!isSearchingUsers &&
                    participantSearch.trim() &&
                    !selectedParticipant &&
                    directoryUsers.length > 0 && (
                      <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-gray-200">
                        {directoryUsers.map((directoryUser) => (
                          <button
                            key={directoryUser._id}
                            type="button"
                            onClick={() => {
                              setSelectedParticipant(directoryUser);

                              setParticipantSearch(
                                `${directoryUser.firstName} ${directoryUser.lastName}`,
                              );
                            }}
                            className="w-full border-b border-gray-100 px-4 py-3 text-left last:border-b-0 hover:bg-gray-50"
                          >
                            <p className="text-sm font-medium text-gray-900">
                              {directoryUser.firstName} {directoryUser.lastName}
                            </p>

                            <p className="text-xs text-gray-500">
                              {directoryUser.email}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}

                  {!isSearchingUsers &&
                    participantSearch.trim() &&
                    !selectedParticipant &&
                    directoryUsers.length === 0 && (
                      <p className="mt-2 text-sm text-gray-500">
                        No users found.
                      </p>
                    )}

                  {selectedParticipant && (
                    <div className="mt-2 rounded-lg bg-gray-50 px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">
                        {selectedParticipant.firstName}{" "}
                        {selectedParticipant.lastName}
                      </p>

                      <p className="text-xs text-gray-500">
                        {selectedParticipant.email}
                      </p>
                    </div>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Subject
                  </label>

                  <input
                    type="text"
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    placeholder="Conversation subject"
                    maxLength={200}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseNewConversation}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    createConversation.isPending ||
                    !selectedParticipant ||
                    !subject.trim()
                  }
                  className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {createConversation.isPending
                    ? "Creating..."
                    : "Start Conversation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
