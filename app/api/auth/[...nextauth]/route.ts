import NextAuth from "next-auth";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { compare, hash } from "bcryptjs";

// Helper to get tenant slug from the request host
async function getTenantSlug() {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  
  let tenantSlug = null;
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'multi-tenant-tournament-platform.vercel.app';
  
  if (host.endsWith(`.${rootDomain}`)) {
    tenantSlug = host.replace(`.${rootDomain}`, '');
  } else if (host !== rootDomain && host !== `www.${rootDomain}`) {
    // Custom domain, we need to look it up in Prisma
    const org = await prisma.organization.findUnique({
      where: { customDomain: host },
      select: { slug: true }
    });
    if (org) {
      tenantSlug = org.slug;
    }
  }
  
  return tenantSlug;
}

export const authOptions: AuthOptions = {
  // @ts-ignore
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isSignUp: { label: "Sign Up", type: "hidden" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const tenantSlug = await getTenantSlug();
        if (!tenantSlug) {
          throw new Error("Invalid tenant domain");
        }

        const organization = await prisma.organization.findUnique({
          where: { slug: tenantSlug }
        });

        if (!organization) {
          throw new Error("Tenant not found");
        }

        const email = credentials.email.toLowerCase().trim();

        // Check if player exists in this tenant
        const player = await prisma.player.findUnique({
          where: {
            email_organizationId: {
              email: email,
              organizationId: organization.id
            }
          }
        });

        if (credentials.isSignUp === 'true') {
          if (player) {
            throw new Error("Email already in use on this tenant");
          }

          // Create new player
          const hashedPassword = await hash(credentials.password, 10);
          const newPlayer = await prisma.player.create({
            data: {
              email: email,
              passwordHash: hashedPassword,
              organizationId: organization.id
            }
          });

          return { id: newPlayer.id, email: newPlayer.email, tenantId: organization.id };
        }

        if (!player || !player.passwordHash) {
          throw new Error("Invalid credentials");
        }

        const isValid = await compare(credentials.password, player.passwordHash);

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return { id: player.id, email: player.email, tenantId: organization.id };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.tenantId = (user as any).tenantId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // @ts-ignore
        session.user.id = token.id;
        // @ts-ignore
        session.user.tenantId = token.tenantId;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
