"use server";

import { logout } from "@/modules/auth/controllers/auth-controller";

export async function signOut() {
  await logout();
}
