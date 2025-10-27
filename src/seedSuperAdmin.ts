import { UserRole, UserStatus } from "@prisma/client";
import { prisma } from "./app/utils/prisma";
import { hashPassword } from "./app/helpers/hashPassword";
import config from "./app/config";

export const seedSuperAdmin = async () => {
  try {
    // Check if super admin already exists
    const existingSuperAdmin = await prisma.user.findFirst({
      where: { role: UserRole.SUPER_ADMIN },
    });

    if (existingSuperAdmin) {
      console.log("✅ Super Admin already exists");
      return;
    }

    // Create super admin if not exists
    if (config.superAdmin.email && config.superAdmin.password) {
      const hashedPassword = await hashPassword(config.superAdmin.password);

      await prisma.user.create({
        data: {
          fullName: "Super Admin",
          email: config.superAdmin.email,
          password: hashedPassword,
          role: UserRole.SUPER_ADMIN,
          status: UserStatus.Active,
          isVerified: true,
        },
      });

      console.log("✅ Super Admin created successfully");
    } else {
      console.log(
        "⚠️ Super Admin credentials not provided in environment variables"
      );
    }
  } catch (error) {
    console.error("❌ Error seeding super admin:", error);
  }
};
