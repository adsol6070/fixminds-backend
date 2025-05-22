import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "../../common/types/user.type";

export interface IUserModel extends IUser, Document {}

const UserSchema = new Schema<IUserModel>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    verificationCode: { type: String },
    passwordResetAt: { type: Date },
    passwordResetToken: { type: String },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUserModel>("User", UserSchema);
