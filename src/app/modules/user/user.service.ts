import { User, UserRole } from "@prisma/client";
import AppError from "../../errors/AppError";
import { httpStatus } from "../../utils/httpStatus";
import prisma from "../../utils/prisma";
import QueryBuilder from "../../builder/QueryBuilder";

const getAllUsers = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(prisma.user, query)
    .search(["name", "email"])
    .select(["id", "email", "name", "profilePic", "status", "role"])
    .paginate();

  const [result, meta] = await Promise.all([
    userQuery.execute(),
    userQuery.countTotal(),
  ]);

  if (!result.length) {
    throw new AppError(httpStatus.NOT_FOUND, "No users found!");
  }

  const data = result.map((user: User) => {
    const { password, ...rest } = user;
    return rest;
  });

  return {
    meta,
    data,
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
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

const updateUser = async (userId: string, payload: Partial<User>) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, profilePic: true },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profilePic: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
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
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status: "Inactive" },
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
  if (!updatedUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

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
