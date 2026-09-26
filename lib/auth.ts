import { NextAuthOptions, DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
  interface User {
    id: string;
    role: string;
  }
}
import PostgresAdapter from "@auth/pg-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import type { Adapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  adapter: {
    async createUser(user: any) {
      const { rows } = await pool.query(
        'INSERT INTO users (name, email, "emailVerified", image, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [user.name, user.email, user.emailVerified, user.image, 'STUDENT']
      );
      return { ...rows[0], id: rows[0].id.toString() };
    },
    async getUser(id: string) {
      const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      if (!rows[0]) return null;
      return { ...rows[0], id: rows[0].id.toString() };
    },
    async getUserByEmail(email: string) {
      const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (!rows[0]) return null;
      return { ...rows[0], id: rows[0].id.toString() };
    },
    async getUserByAccount({ providerAccountId, provider }: any) {
      const { rows } = await pool.query(
        `SELECT u.* FROM users u JOIN accounts a ON u.id = a."userId" 
         WHERE a.provider = $1 AND a."providerAccountId" = $2`,
        [provider, providerAccountId]
      );
      if (!rows[0]) return null;
      return { ...rows[0], id: rows[0].id.toString() };
    },
    async linkAccount(account: any) {
      await pool.query(
        `INSERT INTO accounts (
          "userId", type, provider, "providerAccountId", access_token, token_type, id_token, refresh_token, scope, expires_at, session_state
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          account.userId,
          account.type,
          account.provider,
          account.providerAccountId,
          account.access_token,
          account.token_type,
          account.id_token,
          account.refresh_token,
          account.scope,
          account.expires_at,
          account.session_state
        ]
      );
      return account;
    },
    async updateUser(user: any) {
      // Build dynamic SET clause for updating user
      const updates = [];
      const values = [];
      let i = 1;
      for (const [key, value] of Object.entries(user)) {
        if (key === 'id') continue; // Don't update ID
        updates.push(`"${key}" = $${i}`);
        values.push(value);
        i++;
      }
      values.push(user.id);
      const { rows } = await pool.query(
        `UPDATE users SET ${updates.join(', ')} WHERE id = $${i} RETURNING *`,
        values
      );
      return { ...rows[0], id: rows[0].id.toString() };
    }
  } as Adapter,
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        allowDangerousEmailAccountLinking: true,
      })
    ] : []),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "student@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        try {
          const res = await pool.query("SELECT * FROM users WHERE email = $1", [credentials.email]);
          const user = res.rows[0];

          if (!user || !user.password) {
            throw new Error("Invalid credentials");
          }

          if (user.isBlocked) {
            throw new Error("Your account has been blocked. Please contact support.");
          }

          const isCorrectPassword = await bcrypt.compare(credentials.password, user.password);

          if (!isCorrectPassword) {
            throw new Error("Invalid credentials");
          }

          // Update last_login to track real user activity
          await pool.query("UPDATE users SET last_login = NOW() WHERE id = $1", [user.id]);

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error: any) {
          console.error("Database error during authorization:", error);
          throw new Error(error.message || "Invalid credentials or Database Unreachable");
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        const parsed = new URL(url);
        if (
          parsed.hostname.endsWith("digitalghuru.in") ||
          parsed.hostname.endsWith("digitalghuru.com") ||
          parsed.hostname === "localhost"
        ) {
          return url;
        }
      } catch {
        // Fallback to baseUrl
      }
      return baseUrl;
    }
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
