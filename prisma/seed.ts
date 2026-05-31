import { env } from "@/lib/env";
import bcrypt from "bcryptjs";
import { UserRepo } from "@/db/repos/user.repo";
import { prisma } from "@/db/prisma";

async function main() {
  const email = env.SUPER_ADMIN_EMAIL;

  const existing = await UserRepo.findByMail(email);

  if (existing) {
    console.log("Super Admin already exists");
    return;
  }

  const passwordHash = await bcrypt.hash(env.SUPER_ADMIN_PASSWORD, 10);

  const reqDB = await UserRepo.registerUser(
    email,
    "SuperAdmin",
    passwordHash,
    true,
  );

  console.log("Super Admin Seeded", reqDB?.id);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect;
    process.exit(0);
  });
