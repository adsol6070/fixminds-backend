import { Request, Response } from "express";
import { asyncHandler } from "../../common/utils/async-handler";
import { UserService } from "./user.service";
import { ApiError } from "../../common/utils/api-error";
import mongoose from "mongoose";

const getAllUsers = async (_req: Request, res: Response) => {
  const users = await UserService.findManyUsers(
    {},
    {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    }
  );

  res.status(200).json({
    status: "success",
    results: users.length,
    data: users,
  });
};

const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await UserService.findUniqueUser(
    { _id: new mongoose.Types.ObjectId(id) },
    {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    }
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({
    status: "success",
    data: user,
  });
};

const updateUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const updatedUser = await UserService.updateUser(
    { _id: new mongoose.Types.ObjectId(id) },
    req.body,
    {
      id: true,
      name: true,
      email: true,
      updatedAt: true,
    }
  );

  if (!updatedUser) {
    throw new ApiError(404, "User not found or not updated");
  }

  res.status(200).json({
    status: "success",
    message: "User updated successfully",
    data: updatedUser,
  });
};

const deleteUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedUser = await UserService.deleteUser({
    _id: new mongoose.Types.ObjectId(id),
  });

  if (!deletedUser) {
    throw new ApiError(404, "User not found or already deleted");
  }

  res.status(200).json({
    status: "success",
    message: "User deleted successfully",
  });
};

const getMe = async (_req: Request, res: Response) => {
  const userId = res.locals.user?.id;

  const user = await UserService.findUniqueUser(
    { _id: userId },
    {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    }
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
};

const UserController = {
  getAllUsers: asyncHandler(getAllUsers),
  getUserById: asyncHandler(getUserById),
  updateUserById: asyncHandler(updateUserById),
  deleteUserById: asyncHandler(deleteUserById),
  getMe: asyncHandler(getMe),
};

export default UserController;
