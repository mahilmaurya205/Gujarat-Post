/**
 * Database Seeder — creates the initial SUPER_ADMIN account.
 * Run with:  npx ts-node server/database/seed.ts
 * or:        node -r ts-node/register server/database/seed.ts
 */

import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { AUTH_CONFIG } from "@/server/config/auth";

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@gujaratpost.com";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "Admin@123456";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`ℹ️  Admin user already exists: ${email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, AUTH_CONFIG.BCRYPT_ROUNDS);

  const admin = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    },
  });

  console.log(`✅  SUPER_ADMIN created: ${admin.email} (id: ${admin.id})`);
  console.log(`⚠️  Change the default password immediately after first login.`);
}

main()
  .catch((err) => {
    console.error("❌  Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
