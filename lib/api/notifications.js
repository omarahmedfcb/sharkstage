import { apiFetch } from "./client";

export async function fetchNotifications() {
  const data = await apiFetch("/notifications/user");
  return data.userNotifications ?? [];
}

export async function markNotificationAsRead(notificationId) {
  const data = await apiFetch(`/notifications/read/${notificationId}`, {
    method: "PATCH",
  });
  return data;
}

