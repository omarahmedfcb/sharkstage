"use client";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import {
  Send,
  ArrowLeft,
  MoreVertical,
  Phone,
  Video,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import socket from "@/utils/socket";
import api from "@/lib/axios";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/app/components/NavBar";

const ChatPage = () => {
  const router = useRouter();
  const { conversationId } = useParams();
  const { currentUser } = useSelector((state) => state.auth);

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      message: "",
    },
  });

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversation and messages
  useEffect(() => {
    if (!conversationId || !currentUser) return;

    loadConversation();

    // Join socket room
    socket.emit("join_conversation", conversationId);

    return () => {
      socket.emit("leave_conversation", conversationId);
    };
  }, [conversationId, currentUser]);

  // Socket.io listeners
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      const { message, conversationId: msgConvId } = data;

      // Update messages if in current conversation
      if (conversationId === msgConvId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [conversationId]);

  const loadConversation = async () => {
    try {
      setLoading(true);

      // Load messages
      const response = await api.get(`/chat/${conversationId}`);
      setMessages(response.data.messages || []);

      // Load conversation details
      const convResponse = await api.get("/chat/conversations");
      const foundConv = convResponse.data.conversations.find(
        (c) => c._id === conversationId
      );

      if (foundConv) {
        setConversation(foundConv);

        // Get other participant
        const other = foundConv.participants.find(
          (p) => p._id !== currentUser._id
        );
        setOtherUser(other);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading conversation:", error);
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!data.message.trim() || !otherUser) return;

    const content = data.message.trim();

    reset();

    try {
      await api.post("/chat/send", {
        receiverId: otherUser._id,
        content,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally restore message on error
      reset({ message: content });
    }
  };

  const formatTime = (timestamp) => {
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

  if (!conversation || !otherUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-background via-soft/30 to-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-[0_5px_35px_rgba(0,0,0,0.25)]"
        >
          <p className="text-xl text-heading mb-4">Conversation not found</p>
          <Link
            href="/chat"
            className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-medium"
          >
            Back to Conversations
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col h-screen bg-gradient-to-br from-background via-soft/30 to-background relative overflow-hidden pt-24">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, primary 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Chat Header with Glassmorphism */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-[0_5px_35px_rgba(0,0,0,0.25)] p-4"
          >
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              <Link
                href="/chat"
                className="p-2 hover:bg-white/60 rounded-xl transition-all duration-300 text-heading hover:text-primary hover:scale-110"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              {otherUser?.profilePicUrl ? (
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden ring-4 ring-white/50 shadow-lg">
                    <img
                      src={otherUser.profilePicUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-primary to-secondary rounded-full border-2 border-white shadow-lg"></div>
                </div>
              ) : (
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold ring-4 ring-white/50 shadow-lg">
                    {otherUser?.firstName?.charAt(0)}
                    {otherUser?.lastName?.charAt(0)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-buttons to-primary rounded-full border-2 border-white shadow-lg"></div>
                </div>
              )}
              <div>
                <h2 className="font-bold text-heading text-lg">
                  {otherUser?.firstName} {otherUser?.lastName}
                </h2>
                <p className="text-xs text-paragraph">{otherUser?.email}</p>
              </div>
            </div>
            <button className="p-2 hover:bg-white/60 rounded-xl transition-all duration-300 text-paragraph hover:text-heading">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <AnimatePresence>
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center h-full min-h-[400px]"
                >
                  <div className="text-center bg-white/60 backdrop-blur-md rounded-2xl p-12 shadow-lg border border-white/20">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
                      className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center backdrop-blur-sm"
                    >
                      <Send className="w-10 h-10 text-primary" />
                    </motion.div>
                    <p className="text-lg font-bold text-heading mb-2">
                      No messages yet
                    </p>
                    <p className="text-sm text-paragraph">
                      Send a message to start the conversation
                    </p>
                  </div>
                </motion.div>
              ) : (
                messages.map((message, index) => {
                  const isOwnMessage = message.sender._id === currentUser._id;
                  return (
                    <motion.div
                      key={message._id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: index === messages.length - 1 ? 0.1 : 0,
                      }}
                      className={`flex ${
                        isOwnMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md lg:max-w-lg px-5 py-3 rounded-2xl shadow-lg ${
                          isOwnMessage
                            ? "bg-gradient-to-r from-primary to-secondary text-white"
                            : "bg-white/80 backdrop-blur-md text-heading border border-white/30"
                        }`}
                      >
                        {!isOwnMessage && (
                          <p className="text-xs font-bold mb-1.5 text-paragraph opacity-80">
                            {message.sender.firstName} {message.sender.lastName}
                          </p>
                        )}
                        <p className="break-words text-sm md:text-base leading-relaxed">
                          {message.content}
                        </p>
                        <p
                          className={`text-xs mt-2 ${
                            isOwnMessage
                              ? "text-white/80"
                              : "text-paragraph"
                          }`}
                        >
                          {formatTime(message.createdAt)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input with Glassmorphism */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white/80 backdrop-blur-lg border-t border-white/20 p-4 shadow-[0_-5px_35px_rgba(0,0,0,0.25)]"
        >
          <div className="max-w-4xl mx-auto flex items-center space-x-3">
            <Controller
              name="message"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-5 py-3.5 bg-white/60 backdrop-blur-md border border-white/30 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-heading placeholder:text-paragraph shadow-lg hover:shadow-xl focus:shadow-2xl focus:bg-white/80"
                />
              )}
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3.5 bg-gradient-to-r from-primary to-secondary text-white rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl disabled:hover:shadow-lg"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.form>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
