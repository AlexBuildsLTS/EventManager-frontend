import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { randomBytes } from "node:crypto";

const DEFAULT_PASSWORD_LENGTH = 16;
const prisma = new PrismaClient();

async function main() {
  // Generate a random password for the admin user
  const randomPassword = randomBytes(16).toString("base64url");
  const hashedPassword = await bcrypt.hash(randomPassword, 10);

  // Function to generate a random password
  const generateRandomPassword = (length = DEFAULT_PASSWORD_LENGTH): string => {
    return randomBytes(length).toString("base64url");
  };

  const temporaryPassword = generateRandomPassword();
  const hashedTempPassword = await bcrypt.hash(temporaryPassword, 10);

  // Define the admin user data
  const adminUserData = {
    email: "admin@example.com",
    password: hashedPassword,
    role: Role.ADMIN,
    firstName: "Admin",
    lastName: "User",
    title: "System Administrator",
    name: "Admin User"
  };

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      ...adminUserData,
    },
  });

  console.log("Database has been seeded. Admin user created with:");
  console.log("Email: admin@example.com");
  console.log("Temporary Password:", temporaryPassword);
  console.log("Please remember to change your password upon first login.");
}


main().catch((e) => {
  console.error(e);
});

prisma
  .$connect()
  .then(() => {
    console.log("Successfully connected to database");
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

