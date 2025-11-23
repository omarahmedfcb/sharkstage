"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import api from "@/lib/axios";
import { Search, MessageSquare, Clock, Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/app/components/NavBar";

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
      <div className="min-h-screen bg-gradient-to-br from-background via-soft/30 to-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-[0_5px_35px_rgba(0,0,0,0.25)]"
        >
          <Loader2 className="animate-spin text-primary" size={48} />
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-soft/30 to-background relative overflow-hidden pt-24">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, primary 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative z-10">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            {/* Header Section with Glassmorphism */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 md:p-8 mb-6 shadow-[0_5px_35px_rgba(0,0,0,0.25)] border border-white/20 sticky top-4 z-20"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Messages
              </h1>
            </div>

            {/* Search with Glassmorphism */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-paragraph w-5 h-5" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/60 backdrop-blur-md border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-heading placeholder:text-paragraph shadow-lg hover:shadow-xl focus:shadow-2xl focus:bg-white/80"
              />
            </div>
          </motion.div>

          {/* Conversations List */}
          <div className="space-y-4 pb-8">
            {filteredConversations.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-12 md:p-16 text-center shadow-[0_5px_35px_rgba(0,0,0,0.25)] border border-white/20"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
                  className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center backdrop-blur-sm"
                >
                  <MessageSquare className="w-12 h-12 text-primary" />
                </motion.div>
                <h2 className="text-2xl font-bold text-heading mb-3">
                  {searchQuery
                    ? "No conversations found"
                    : "No conversations yet"}
                </h2>
                <p className="text-paragraph text-lg">
                  {searchQuery
                    ? "Try searching for a different name"
                    : "Start a conversation from a project"}
                </p>
              </motion.div>
            ) : (
              filteredConversations.map((convo, index) => {
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
                  <motion.div
                    key={convo._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="group"
                  >
                    <Link
                      href={`/chat/${convo._id}`}
                      className="block bg-white/80 backdrop-blur-lg rounded-2xl p-5 md:p-6 hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)] border border-white/20 hover:border-primary/30 relative overflow-hidden"
                    >
                      {/* Gradient Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative flex items-start gap-4">
                        {/* Avatar with Enhanced Design */}
                        {otherUser?.profilePicUrl ? (
                          <div className="relative flex-shrink-0">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden ring-4 ring-white/50 group-hover:ring-primary/30 transition-all duration-300 shadow-lg">
                              <img
                                src={otherUser.profilePicUrl}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-primary to-secondary rounded-full border-2 border-white shadow-lg"></div>
                          </div>
                        ) : (
                          <div className="relative flex-shrink-0">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg ring-4 ring-white/50 group-hover:ring-primary/30 transition-all duration-300 shadow-lg">
                              {otherUser?.firstName?.charAt(0)}
                              {otherUser?.lastName?.charAt(0)}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-buttons to-primary rounded-full border-2 border-white shadow-lg"></div>
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between mb-2">
                            <h3 className="font-bold text-heading text-lg md:text-xl truncate group-hover:text-primary transition-colors">
                              {name}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-paragraph ml-2 flex-shrink-0 bg-white/60 backdrop-blur-sm px-2 py-1 rounded-lg">
                              <Clock className="w-3.5 h-3.5" />
                              <span className="font-medium">{formatTime(messageTime)}</span>
                            </div>
                          </div>

                          <p className="text-sm md:text-base text-paragraph truncate group-hover:text-heading transition-colors">
                            {lastMessage.length > 60
                              ? `${lastMessage.slice(0, 60)}...`
                              : lastMessage}
                          </p>
                        </div>

                        {/* Arrow Indicator */}
                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                            <ArrowLeft className="w-4 h-4 text-white rotate-180" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })
            )}
          </div>
          </div>
        </div>
      </div>
    </>
  );
}
