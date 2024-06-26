import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import prisma from "../../../prisma/prismadb";

export const authOptions: AuthOptions = {
  // Use PrismaAdapter to manage user sessions with Prisma
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    // Configure custom credentials provider for email/password authentication
    CredentialsProvider({
      name: "credentials",
      // Define credentials fields (email and password)
      credentials: {
        email: {
          label: "email",
          type: "email",
        },
        password: {
          label: "password",
          type: "password",
        },
      },
      // Authorize function to validate credentials
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Invalid email or password");
        }
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        if (!user || !user.hashedPassword) {
          throw new Error("Invalid email or password");
        }
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword,
        );
        if (!isCorrectPassword) {
          throw new Error("Invalid email or password");
        }
        return user; // Return user if authenticated successfully
      },
    }),
  ],
  pages: {
    signIn: "/login", // Set login page
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
