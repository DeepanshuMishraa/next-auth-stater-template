import prisma from "@/utils/db";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import { User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { SignInSchema } from "@/validators/auth.validators";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "signin",
      id: "signin",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Enter email address",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter password",
        },
      },

      async authorize(credentials): Promise<User | null> {
        const parsedData = SignInSchema.safeParse(credentials);
        if (!parsedData.success) {
          throw new Error("Invalid data");
        }

        const { email, password } = parsedData.data;

        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
          select: {
            password: true,
            email: true,
            name: true,
            id: true,
          },
        });

        if (!user) {
          throw new Error("User not found");
        }

        const passMatch = await bcrypt.compare(
          password,
          user.password as string
        );
        if (!passMatch) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: email,
          name: user.name,
        };
      },
    }),
  ],

  callbacks: {
    async signIn(params: any) {
      if (
        !params.user.email ||
        !params.user.name ||
        !params.account?.provider
      ) {
        return false;
      }

      // we will check if the user already exists, if he does we will return true

      const user = await prisma.user.findUnique({
        where: {
          email: params.user.email,
        },
      });

      if (!user) {
        await prisma.user.create({
          data: {
            email: params.user?.email,
            name: params.user?.name,
            provider: params.account?.provider,
          },
        });

        return true;
      }

      return true;
    },
  },
};
