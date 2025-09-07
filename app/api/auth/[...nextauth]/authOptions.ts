import { StrapiErrorT, StrapiLoginResponseT } from "@/lib/types";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "email and password",
      credentials: {
        identifier: {
          label: "Email or username *",
          type: "text",
        },
        password: { label: "Password *", type: "password" },
      },
      async authorize(credentials, req) {
        // make sure the are credentials
        if (!credentials || !credentials.identifier || !credentials.password) {
          console.log("No credentials");
          return null;
        }
        try {
          const strapiResponse = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`,
            {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({
                identifier: credentials!.identifier,
                password: credentials!.password,
              }),
            }
          );

          if (!strapiResponse.ok) {
            // return error to signIn callback
            const contentType = strapiResponse.headers.get("content-type");
            if (contentType === "application/json; charset=utf-8") {
              const data: StrapiErrorT = await strapiResponse.json();
              throw new Error(data.error.message);
            } else {
              throw new Error(strapiResponse.statusText);
            }
          }

          // success
          const data: StrapiLoginResponseT = await strapiResponse.json();
          return {
            name: data.user.username,
            email: data.user.email,
            fullname: data.user.username,
            id: data.user.id.toString(),
            strapiUserId: data.user.id,
            blocked: data.user.blocked,
            strapiToken: data.jwt,
          };
        } catch (error) {
          // Catch errors in try but also f.e. connection fails
          console.log("Error in authorize:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      return true;
    },

    async jwt({ token, trigger, account, user, session }) {
      // change username update
      if (trigger === "update" && session?.username) {
        token.name = session.username;
      }

      // change password update
      if (trigger === "update" && session?.strapiToken) {
        token.strapiToken = session.strapiToken;
      }

      if (account) {
        if (account.provider === "credentials") {
          token.strapiToken = user.strapiToken;
          token.strapiUserId = user.strapiUserId;
          token.provider = account.provider;
          token.blocked = user.blocked;
        }
      }
      return token;
    },

    async session({ token, session }) {
      session.strapiToken = token.strapiToken;
      session.provider = token.provider;
      session.user.strapiUserId = token.strapiUserId;
      session.user.blocked = token.blocked;

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    // signOut: "/logout",
    // newUser: "/register",
  },
};