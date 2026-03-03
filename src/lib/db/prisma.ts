import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function ensureDatabase(): void {
  // On Netlify serverless, filesystem is read-only except /tmp
  // SQLite needs write access for journal files, so copy DB to /tmp
  if (process.env.NETLIFY) {
    const tmpDbPath = "/tmp/dev.db";

    if (!fs.existsSync(tmpDbPath)) {
      const possibleSources = [
        path.join(process.cwd(), "prisma", "dev.db"),
        path.resolve(__dirname, "..", "..", "..", "prisma", "dev.db"),
        path.resolve(__dirname, "..", "..", "prisma", "dev.db"),
        path.resolve(__dirname, "..", "prisma", "dev.db"),
      ];

      for (const src of possibleSources) {
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, tmpDbPath);
          break;
        }
      }
    }

    if (fs.existsSync(tmpDbPath)) {
      process.env.DATABASE_URL = `file:${tmpDbPath}`;
    }
  }
}

function createPrismaClient(): PrismaClient {
  ensureDatabase();
  return new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
