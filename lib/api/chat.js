import { apiFetch } from "./client";

export async function fetchConversations() {
  const data = await apiFetch("/chat/conversations");
  return data.conversations ?? [];
}

export async function fetchMessages(conversationId) {
  const data = await apiFetch(`/chat/${conversationId}`);
  return data.messages ?? [];
}

