import { apiFetch } from "./client";

export async function updateProfile(payload) {
  const data = await apiFetch("/auth/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return data.user;
}

export async function changePassword(payload) {
  const data = await apiFetch("/auth/password", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return data;
}

export async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append("profilePicUrl", file);

  const response = await apiFetch("/auth/upload-profile-picture", {
    method: "POST",
    body: formData,
  });

  return response.imageUrl;
}

export async function removeAvatar() {
  const response = await apiFetch("/auth/remove-profile-picture", {
    method: "DELETE",
  });
  return response;
}

