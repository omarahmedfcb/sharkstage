import { apiFetch } from "./client";

export async function fetchAllProjects() {
  const data = await apiFetch("/projects");
  return data.allProjects ?? [];
}

export async function fetchProjectById(id) {
  if (!id) {
    throw new Error("Project id is required");
  }
  const data = await apiFetch(`/projects/${id}`);
  return data.project;
}

export async function fetchProjectsForUser(userId) {
  if (!userId) {
    throw new Error("User id is required");
  }
  const data = await apiFetch(`/projects/user/${userId}`);
  return data.userProjects ?? [];
}

