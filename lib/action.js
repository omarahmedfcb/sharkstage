"use server";

import { redirect } from "next/navigation";
import { makeStore } from "./store";

export async function registerNewUser(formData) {
  redirect("/");
}
