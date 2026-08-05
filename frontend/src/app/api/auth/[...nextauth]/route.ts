/**
 * app/api/auth/[...nextauth]/route.ts
 *
 * NextAuth v5 (Auth.js) catch-all route handler for Next.js App Router.
 * All configuration lives in the root auth.ts file.
 */
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
