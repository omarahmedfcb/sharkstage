"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import api from "@/lib/axios";
import { Search, MessageSquare, Clock, Loader2, ArrowLeft } from "lucide-react";

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get("/chat/conversations");
        const sorted = (res.data.conversations || []).sort((a, b) => {
          const dateA = a.lastMessage?.createdAt || a.updatedAt;
          const dateB = b.lastMessage?.createdAt || b.updatedAt;
          return new Date(dateB) - new Date(dateA);
        });
        setConversations(sorted);
        setFilteredConversations(sorted);
      } catch (err) {
        console.error("Error fetching conversations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter((convo) => {
        const otherUser = convo.participants.find(
          (p) => p._id !== currentUser?._id
        );
        const name =
          `${otherUser?.firstName} ${otherUser?.lastName}`.toLowerCase();
        return name.includes(searchQuery.toLowerCase());
      });
      setFilteredConversations(filtered);
    }
  }, [searchQuery, conversations, currentUser]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else if (diffInHours < 168) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Link
        href={"/"}
        className="flex gap-2 items-center m-2 hover:text-primary transition-colors"
      >
        <ArrowLeft />
        <span>Back to home</span>
      </Link>
      <div className="max-w-4xl mx-auto">
        <div className=" border-b border-gray-200 sticky top-0 z-10">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Messages</h1>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div className="p-4">
          {filteredConversations.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <MessageSquare className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery
                  ? "No conversations found"
                  : "No conversations yet"}
              </h2>
              <p className="text-gray-500">
                {searchQuery
                  ? "Try searching for a different name"
                  : "Start a conversation from a project"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredConversations.map((convo) => {
                const otherUser = convo.participants.find(
                  (p) => p._id !== currentUser?._id
                );

                const name = otherUser
                  ? `${otherUser.firstName} ${otherUser.lastName}`
                  : "Unknown User";

                const lastMessage =
                  convo.lastMessage?.content || "No messages yet";

                const messageTime =
                  convo.lastMessage?.createdAt || convo.updatedAt;

                return (
                  <Link
                    key={convo._id}
                    href={`/chat/${convo._id}`}
                    className="block bg-white rounded-2xl p-4 hover:shadow-md hover:scale-[1.01] transition-all duration-200 border border-gray-100"
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      {otherUser?.profilePicUrl ? (
                        <div className="w-14 h-14 rounded-full overflow-hidden">
                          <img
                            src={otherUser.profilePicUrl}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                          {otherUser?.firstName?.charAt(0)}
                          {otherUser?.lastName?.charAt(0)}
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 text-lg truncate">
                            {name}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-gray-500 ml-2 flex-shrink-0">
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(messageTime)}</span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 truncate">
                          {lastMessage.length > 60
                            ? `${lastMessage.slice(0, 60)}...`
                            : lastMessage}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
