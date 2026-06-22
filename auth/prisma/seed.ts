import { PrismaClient } from "@prisma/client";
import { PasswordManagementHelperService } from "../src/services";
import { Permission, Role } from "../../packages/shared/src/enums";

const prisma = new PrismaClient();

async function main() {
  // seed ADMIN USER
  const hashedPassword = await PasswordManagementHelperService.toHash("admin");
  const user = await prisma.user.create({
    data: {
      email: "admin@book-my-movie.com",
      phone: "9999999999",
      passwordHash: hashedPassword,
      status: "ACTIVE",
    },
  });

  // seed roles("ADMIN",,"THEATER_OWNER","USER")
  await prisma.role.createMany({
    data: [
      {
        name: Role.ADMIN,
        permissions: [
          Permission.USER_READ,
          Permission.USER_UPDATE,
          Permission.USER_DELETE,
          Permission.THEATER_CREATE,
          Permission.THEATER_UPDATE,
          Permission.THEATER_DELETE,
        ],
      },
      {
        name: Role.THEATER_OWNER,
        permissions: [
          Permission.THEATER_CREATE,
          Permission.THEATER_UPDATE,
          Permission.THEATER_DELETE,
          Permission.SHOW_CREATE,
          Permission.SHOW_UPDATE,
        ],
      },
      {
        name: Role.USER,
        permissions: [Permission.BOOKING_CREATE, Permission.BOOKING_CANCEL],
      },
    ],
  });
  // add seed one row of role admin with "admin@book-my-movie.com"
  const adminRole = await prisma.role.findUnique({
    where: {
      name: Role.ADMIN,
    },
  });
  await prisma.userRole.create({
    data: {
      userId: user.id,
      roleId: adminRole!.id,
    },
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
