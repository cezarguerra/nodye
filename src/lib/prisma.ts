import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

// Pega o ID do usuário da sessão
async function getSession() {
  const session = await auth();

  return session;
}

let prismaBase: PrismaClient;
let prismaWithExtensions: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prismaBase = new PrismaClient({
    datasources: { db: { url: process.env.DIRECT_URL } },
  });
  prismaWithExtensions = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
  });
} else {
  const globalWithPrisma = global as typeof globalThis & {
    prismaBase: PrismaClient;
    prismaWithExtensions: PrismaClient;
  };

  if (!globalWithPrisma.prismaBase) {
    globalWithPrisma.prismaBase = new PrismaClient({
      datasources: { db: { url: process.env.DIRECT_URL } },
    });
  }
  if (!globalWithPrisma.prismaWithExtensions) {
    globalWithPrisma.prismaWithExtensions = new PrismaClient({
      datasources: { db: { url: process.env.DATABASE_URL } },
    });
  }

  prismaBase = globalWithPrisma.prismaBase;
  prismaWithExtensions = globalWithPrisma.prismaWithExtensions;
}

const prismaWith = prismaWithExtensions.$extends({
  name: "tenantIsolation",
  query: {
    async $allOperations({ args, query }) {
      const session = (await getSession()) || null;

      // // Recursively search for contaid in args
      // const findContaid = (
      //   obj: Record<string, unknown>
      // ): string | undefined => {
      //   if (typeof obj !== "object" || obj === null) return undefined;

      //   if ("contaid" in obj && typeof obj.contaid === "string")
      //     return obj.contaid;

      //   for (const key in obj) {
      //     if (typeof obj[key] === "object") {
      //       const result = findContaid(obj[key] as Record<string, unknown>);
      //       if (result) return result;
      //     }
      //   }

      //   return undefined;
      // };
      // Recursively search for contaid in args
      const findLicenceId = (
        obj: Record<string, unknown>
      ): string | undefined => {
        if (typeof obj !== "object" || obj === null) return undefined;

        if ("licenceId" in obj && typeof obj.licenceId === "string")
          return obj.licenceId;

        for (const key in obj) {
          if (typeof obj[key] === "object") {
            const result = findLicenceId(obj[key] as Record<string, unknown>);
            if (result) return result;
          }
        }

        return undefined;
      };

      const userId: string = session?.user.id || null;
      const licenceId = session?.user.licenceId || findLicenceId(args) || null;

      // userid &&
      await prismaWithExtensions.$executeRaw`SELECT set_config('app.current_user_id', ${userId}, false)`;
      await prismaWithExtensions.$executeRaw`SELECT set_config('app.current_conta_id', ${licenceId}, false)`;

      return query(args);
    },
  },
});

export { prismaBase as prismabase, prismaWith as prisma };
