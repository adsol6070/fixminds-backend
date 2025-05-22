import { signJwt } from "../../common/utils/jwt";
import { IUserModel, User } from "./user.model";
import { FilterQuery } from "mongoose";
import { IUser } from "../../common/types/user.type";

export const excludedFields = [
  "password",
  "verified",
  "verificationCode",
  "passwordResetAt",
  "passwordResetToken",
];

export const UserService = {
  createUser: async (input: Partial<IUser>) => {
    const user = new User(input);
    return await user.save();
  },

  findUser: async (
    query: FilterQuery<IUserModel>,
    select: any = {}
  ): Promise<IUserModel | null> => {
    return await User.findOne(query).select(select).exec();
  },

  findUniqueUser: async (
    query: FilterQuery<IUserModel>,
    select: any = {}
  ): Promise<IUserModel | null> => {
    return await User.findOne(query).select(select).exec();
  },

  findManyUsers: async (
    query: FilterQuery<IUserModel>,
    select: any = {}
  ): Promise<IUserModel[]> => {
    return await User.find(query).select(select).exec();
  },

  updateUser: async (
    query: FilterQuery<IUserModel>,
    data: Partial<IUser>,
    select: any = {}
  ): Promise<IUserModel | null> => {
    return await User.findOneAndUpdate(query, data, {
      new: true,
    })
      .select(select)
      .exec();
  },

  deleteUser: async (
    query: FilterQuery<IUserModel>
  ): Promise<IUserModel | null> => {
    return await User.findOneAndDelete(query).exec();
  },

  signTokens: async (user: IUserModel) => {
    const accessTokenPrivateKey = Buffer.from(
      process.env.JWT_ACCESS_TOKEN_PRIVATE_KEY!,
      "base64"
    ).toString("ascii");

    const refreshTokenPrivateKey = Buffer.from(
      process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY!,
      "base64"
    ).toString("ascii");

    const access_token = signJwt({ sub: user._id }, accessTokenPrivateKey, {
      expiresIn: "240m",
    });

    const refresh_token = signJwt({ sub: user._id }, refreshTokenPrivateKey, {
      expiresIn: "240m",
    });

    return { access_token, refresh_token };
  },

  rollbackUserAction: async (data: { to: string; templateName: string }) => {
    if (data.templateName === "verify-email") {
      await User.updateMany(
        { email: data.to },
        { $set: { verificationCode: null, verified: false } }
      );
      console.log(`Rolled back verification info for ${data.to}`);
    } else if (data.templateName === "reset-password") {
      await User.updateMany(
        { email: data.to },
        { $set: { passwordResetToken: null, passwordResetAt: null } }
      );
      console.log(`Rolled back password reset info for ${data.to}`);
    } else {
      console.warn(
        `No rollback action defined for template ${data.templateName}`
      );
    }
  },
};
