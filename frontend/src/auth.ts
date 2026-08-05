import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        return true; // Already validated in authorize()
      }

      try {
        await connectDB();

        if (!user.email) return false;

        const existingUser = await User.findOne({
          email: user.email.toLowerCase().trim(),
        });

        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email.toLowerCase().trim(),
            image: user.image ?? null,
            provider: account?.provider, // "github" | "google"
          });
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
      return token;
    },

    /**
     * Expose the DB id on the client-accessible session.user object.
     */
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
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
});
