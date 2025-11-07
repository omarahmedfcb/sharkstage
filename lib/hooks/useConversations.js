"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchConversations } from "@/lib/api/chat";

const FALLBACK_CONVERSATIONS = [
  {
    _id: "fallback-conv-1",
    participants: [
      { _id: "1", firstName: "Layla", lastName: "Ahmad" },
      { _id: "2", firstName: "Sarah", lastName: "Mitchell" },
    ],
    lastMessage: {
      content: "Looking forward to reviewing the updated pitch deck!",
      createdAt: new Date().toISOString(),
    },
    updatedAt: new Date().toISOString(),
  },
];

export function useConversations({ eager = true } = {}) {
  const { currentUser } = useSelector((state) => state.auth);
  const [conversations, setConversations] = useState(FALLBACK_CONVERSATIONS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!eager || !currentUser?._id) return undefined;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchConversations();
        if (!cancelled && data.length) {
          setConversations(data);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError(err.message || "Unable to load conversations");
          setConversations(FALLBACK_CONVERSATIONS);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [currentUser?._id, eager]);

  return {
    conversations,
    loading,
    error,
  };
}

