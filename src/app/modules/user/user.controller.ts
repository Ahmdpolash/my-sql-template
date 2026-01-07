import { httpStatus } from "../../utils/httpStatus";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserService.getAllUsers(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "All Users retrieved Successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getUserById = catchAsync(async (req, res) => {
  const result = await UserService.getUserById(req.params.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User fetched successfully!",
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const result = await UserService.updateUser(req.params.userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User updated successfully!",
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const result = await UserService.deleteUser(req.params.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: result.message,
  });
});

const softDeleteUser = catchAsync(async (req, res) => {
  const result = await UserService.softDeleteUser(req.params.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User deleted successfully!",
  });
});

const updateUserRole = catchAsync(async (req, res) => {
  const result = await UserService.updateUserRole(
    req.params.userId,
    req.body.role
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User role updated successfully!",
    data: result,
  });
});

export const UserController = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole,
  softDeleteUser,
};
