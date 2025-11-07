"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useConversations } from "@/lib/hooks/useConversations";
import { fetchMessages } from "@/lib/api/chat";

const FALLBACK_MESSAGES = [
  {
    _id: "fallback-message-1",
    content: "Thanks for sharing the documents. I'll review them tonight.",
    sender: { firstName: "Layla", lastName: "Ahmad" },
    createdAt: new Date().toISOString(),
  },
];

function formatRelativeDate(input) {
  if (!input) return "just now";
  const date = new Date(input);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `${diffDays} d ago`;
  return date.toLocaleDateString("en", { month: "short", day: "numeric" });
}

function getParticipantName(currentUserId, participants) {
  const others = participants.filter((participant) => participant._id !== currentUserId);
  if (!others.length) return "Direct conversation";
  return others
    .map((participant) => `${participant.firstName ?? ""} ${participant.lastName ?? ""}`.trim())
    .join(", ");
}

export default function MessagesPage() {
  const { currentUser } = useSelector((state) => state.auth);
  const currentUserId = currentUser?._id;
  const { conversations, loading, error } = useConversations();
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState(FALLBACK_MESSAGES);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);

  useEffect(() => {
    if (!selectedConversationId && conversations.length) {
      setSelectedConversationId(conversations[0]._id);
    }
  }, [conversations, selectedConversationId]);

  useEffect(() => {
    let cancelled = false;
    if (!selectedConversationId) return undefined;

    async function loadMessages() {
      setMessagesLoading(true);
      setMessagesError(null);
      try {
        const data = await fetchMessages(selectedConversationId);
        if (!cancelled && data.length) {
          setMessages(data);
        } else if (!cancelled && !data.length) {
          setMessages([]);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setMessagesError(err.message || "Unable to load messages");
          setMessages(FALLBACK_MESSAGES);
        }
      } finally {
        if (!cancelled) {
          setMessagesLoading(false);
        }
      }
    }

    loadMessages();

    return () => {
      cancelled = true;
    };
  }, [selectedConversationId]);

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation._id === selectedConversationId),
    [conversations, selectedConversationId]
  );

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="h-24 rounded-3xl border border-primary/10 bg-white/70 shadow-sm animate-pulse" />
        <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
          <div className="h-[500px] rounded-3xl border border-primary/10 bg-white/70 shadow-sm animate-pulse" />
          <div className="h-[500px] rounded-3xl border border-primary/10 bg-white/70 shadow-sm animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <header className="rounded-3xl border border-primary/10 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-heading md:text-3xl">Inbox</h1>
            <p className="text-sm text-paragraph">
              Maintain momentum with investors and project owners using real-time messaging.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <MessageCircle size={14} /> {conversations.length} conversations
          </div>
        </div>
        {error && (
          <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}. Displaying cached conversations until we reconnect.
          </div>
        )}
      </header>

      <section className="grid gap-6 lg:grid-cols-[320px,1fr]">
        <aside className="rounded-3xl border border-primary/10 bg-white/90 p-4 shadow-sm">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-2xl border border-primary/20 bg-white px-4 py-2 text-sm text-heading shadow-sm placeholder:text-paragraph/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <ul className="space-y-3">
            {conversations.map((conversation) => (
              <li key={conversation._id}>
                <button
                  onClick={() => setSelectedConversationId(conversation._id)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                    conversation._id === selectedConversationId
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-primary/10 bg-white text-heading hover:border-primary/20 hover:bg-primary/5"
                  }`}
                >
                  <p className="font-semibold">
                    {getParticipantName(currentUserId, conversation.participants)}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-paragraph">
                    {conversation.lastMessage?.content ??
                      "No messages yet. Start a conversation to build the relationship."}
                  </p>
                  <p className="mt-2 text-[10px] uppercase text-paragraph/60">
                    {formatRelativeDate(conversation.updatedAt)}
                  </p>
                </button>
              </li>
            ))}
            {!conversations.length && (
              <li className="rounded-2xl border border-primary/10 bg-primary/5 px-4 py-6 text-center text-xs text-paragraph">
                No conversations yet. Reach out to matched partners to start collaborating.
              </li>
            )}
          </ul>
        </aside>

        <div className="flex h-[520px] flex-col rounded-3xl border border-primary/10 bg-white/90 shadow-sm">
          {selectedConversation ? (
            <>
              <header className="flex items-center justify-between border-b border-primary/10 px-6 py-4">
                <div>
                  <p className="text-sm font-semibold text-heading">
                    {getParticipantName(currentUserId, selectedConversation.participants)}
                  </p>
                  <p className="text-xs text-paragraph">
                    Updated {formatRelativeDate(selectedConversation.updatedAt)}
                  </p>
                </div>
                <button className="rounded-full border border-primary/20 px-3 py-1 text-xs font-semibold text-primary transition hover:border-primary/40">
                  View project
                </button>
              </header>
              <div className="flex-1 space-y-3 overflow-y-auto px-6 py-4">
                {messagesLoading ? (
                  <div className="flex items-center justify-center py-10 text-primary">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                ) : messages.length ? (
                  messages.map((message) => (
                    <div
                      key={message._id}
                      className="max-w-lg rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm text-heading"
                    >
                      <p className="font-semibold text-primary">
                        {message.sender
                          ? `${message.sender.firstName ?? ""} ${message.sender.lastName ?? ""}`.trim()
                          : "Partner"}
                      </p>
                      <p className="mt-1 text-paragraph">{message.content}</p>
                      <p className="mt-2 text-[10px] uppercase text-paragraph/60">
                        {formatRelativeDate(message.createdAt)}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="grid h-full place-items-center text-sm text-paragraph">
                    Start the conversation to align on next steps.
                  </div>
                )}
                {messagesError && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
                    {messagesError}
                  </div>
                )}
              </div>
              <footer className="border-t border-primary/10 px-6 py-4">
                <form className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    disabled
                    className="w-full rounded-2xl border border-primary/20 bg-white px-4 py-2 text-sm text-heading shadow-sm placeholder:text-paragraph/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-100"
                  />
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white opacity-60"
                  >
                    <Send size={14} /> Send
                  </button>
                </form>
                <p className="mt-2 text-[10px] text-paragraph/60">
                  Real-time messaging will be activated once Socket.io client is connected.
                </p>
              </footer>
            </>
          ) : (
            <div className="grid flex-1 place-items-center text-sm text-paragraph">
              Select a conversation to view the message history.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

