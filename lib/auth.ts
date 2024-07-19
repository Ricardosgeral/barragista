// just to simplify and get the user without always writting session?.user
// reusable libs to use with authJs in server side
// in actions, in server components and in API routes (all server side)
import { auth } from "@/auth";
import { cache } from "react"; // to avoid multiple calls (see https://youtube.com/watch?v=8vJ3JC9O2Eo)

export const currentUser = cache(async () => {
  const session = await auth();
  return session?.user;
});
export const currentRole = cache(async () => {
  const session = await auth();
  return session?.user?.role;
});
