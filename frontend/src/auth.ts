import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

// DEBUG: Log Environment Variables to verify they are loaded in production
console.log("=== NEXTAUTH RUNTIME ENV CHECK ===");
console.log("AUTH_URL is defined:", !!process.env.AUTH_URL);
console.log("AUTH_SECRET is defined:", !!process.env.AUTH_SECRET);
console.log("AUTH_GOOGLE_ID is defined:", !!process.env.AUTH_GOOGLE_ID);
console.log("AUTH_GOOGLE_SECRET is defined:", !!process.env.AUTH_GOOGLE_SECRET);
console.log("AUTH_GITHUB_ID is defined:", !!process.env.AUTH_GITHUB_ID);
console.log("AUTH_GITHUB_SECRET is defined:", !!process.env.AUTH_GITHUB_SECRET);
console.log("If any of these are false, check Vercel Environment Variables (must match these exact names)!");
console.log("==================================");

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),

    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),

    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials ?? {};

        if (!email || !password || typeof email !== "string" || typeof password !== "string") {
          throw new Error("Invalid email or password.");
        }

        await connectDB();

        const user = await User.findOne({ email: email.toLowerCase().trim() });

        // No user found
        if (!user) {
          throw new Error("Invalid email or password.");
        }

        // Account created via OAuth only — no password stored
        if (!user.password) {
          throw new Error("Invalid email or password.");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          throw new Error("Invalid email or password.");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image ?? null,
        };
      },
    }),
  ],

  callbacks: {
    /**
     * Fires after every successful OAuth sign-in.
     * Auto-creates a User record on first login; skips for credentials.
     */
    async signIn({ user, account, profile }) {
      console.log("[NextAuth DEBUG] signIn callback triggered for provider:", account?.provider);
      console.log("[NextAuth DEBUG] User object:", JSON.stringify(user, null, 2));
      console.log("[NextAuth DEBUG] Profile object:", JSON.stringify(profile, null, 2));

      if (account?.provider === "credentials") {
        return true; // Already validated in authorize()
      }

      try {
        console.log("[NextAuth DEBUG] Connecting to DB with URI:", process.env.MONGODB_URI?.replace(/:([^:@]+)@/, ':***@'));
        await connectDB();
        console.log("[NextAuth DEBUG] DB connected successfully");

        if (!user.email) {
          console.error("[NextAuth DEBUG] FAILED: user.email is null or undefined");
          return false;
        }

        console.log("[NextAuth DEBUG] Looking up user by email:", user.email);
        const existingUser = await User.findOne({
          email: user.email.toLowerCase().trim(),
        });

        if (!existingUser) {
          console.log("[NextAuth DEBUG] Creating new user record...");
          await User.create({
            name: user.name,
            email: user.email.toLowerCase().trim(),
            image: user.image ?? null,
            provider: account?.provider, // "github" | "google"
          });
          console.log("[NextAuth DEBUG] New user created successfully");
        } else {
          console.log("[NextAuth DEBUG] Existing user found");
        }

        return true;
      } catch (err) {
        console.error("[NextAuth] signIn callback error:", err);
        return false;
      }
    },

    /**
     * Attach MongoDB _id to the JWT token on initial sign-in.
     * Look it up by email on subsequent requests if not yet set.
     */
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      } else if (token.email && !token.id) {
        try {
          await connectDB();
          const dbUser = await User.findOne({
            email: token.email.toLowerCase().trim(),
          }).lean();
          if (dbUser) {
            token.id = dbUser._id.toString();
          }
        } catch {
          // Non-fatal — session will work without DB id
        }
      }

      if (token.id && token.email && !token.backendToken) {
        const payload = {
          sub: token.id,
          email: token.email,
          role: "user",
        };
        // Use AUTH_SECRET to sign the backend token so the backend can verify it.
        // Important: The backend must have JWT_SECRET set to the same value as AUTH_SECRET.
        token.backendToken = jwt.sign(
          payload,
          process.env.AUTH_SECRET || "default_secret",
          { expiresIn: "7d" }
        );
      }

      return token;
    },

    /**
     * Expose the DB id on the client-accessible session.user object.
     */
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
      }
      if (token?.backendToken) {
        // We cast session to any to bypass the default session type without extending it, 
        // though in a real app you'd extend the Session type via a d.ts file.
        (session as any).backendToken = token.backendToken;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.AUTH_SECRET,
  trustHost: true,
  debug: true, // Added for debugging deployed issues
});
