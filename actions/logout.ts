"use server";

import { signOut } from "@/auth";
import { cookies } from "next/headers";

export const logout = async () => {
  const allCookies = cookies().getAll();
  // Iterate through all cookies and delete then
  allCookies.forEach((cookie) => {
    cookies().set({
      name: cookie.name,
      value: "",
      path: "/",
      maxAge: -1, // This will cause the cookie to be deleted
    });
  });
  await signOut({ redirectTo: "/", redirect: true });
};
