import { User, UserRole } from "@prisma/client";
import AppError from "../../errors/AppError";
import { httpStatus } from "../../utils/httpStatus";
import prisma from "../../utils/prisma";
import QueryBuilder from "../../builder/QueryBuilder";

const getAllUsers = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(prisma.user, {
    isDeleted: false,
    ...query,
  })
    .search(["name", "email"])
    .select(["id", "email", "name", "profilePic", "status", "role", "profile"])
    .paginate();

  const [result, meta] = await Promise.all([
    userQuery.execute(),
    userQuery.countTotal(),
  ]);

  return {
    meta,
    data: result,
  };
};

const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profilePic: true,
      status: true,
      isVerified: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
      profile: true,
    },
  });

  if (!user || user.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

interface IUpdateUserPayload {
  name?: string;
  profilePic?: string;
  displayName?: string;
  bio?: string;
  currentCountry?: string;
  currentCity?: string;
  language?: string;
  interests?: string[];
  isProfilePrivate?: boolean;
}

const updateUser = async (userId: string, payload: IUpdateUserPayload) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, isDeleted: true },
  });

  if (!user || user.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Separate User fields and Profile fields
  const { name, profilePic, ...profileData } = payload;

  const userData: Record<string, any> = {};
  if (name !== undefined) userData.name = name;
  if (profilePic !== undefined) userData.profilePic = profilePic;

  const cleanProfileData: Record<string, any> = {};
  for (const [key, value] of Object.entries(profileData)) {
    if (value !== undefined) {
      cleanProfileData[key] = value;
    }
  }

  const hasProfileUpdates = Object.keys(cleanProfileData).length > 0;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...userData,
      ...(hasProfileUpdates
        ? {
            profile: {
              upsert: {
                create: { ...cleanProfileData },
                update: { ...cleanProfileData },
              },
            },
          }
        : {}),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profilePic: true,
      isVerified: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      profile: true,
    },
  });

  return updatedUser;
};

const deleteUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  return { message: "User deleted successfully" };
};

const softDeleteUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user || user.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      status: "Inactive",
      isDeleted: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      isDeleted: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

const updateUserRole = async (userId: string, role: UserRole) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

export const UserService = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole,
  softDeleteUser,
};
