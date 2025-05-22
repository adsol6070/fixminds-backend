import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import { UserService } from "../user/user.service";
import { asyncHandler } from "../../common/utils/async-handler";

import { ApiError } from "../../common/utils/api-error";
import { publishEmail } from "../../messaging/producers/email.producer";

const register = async (req: Request, res: Response): Promise<any> => {
  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  const verifyCode = crypto.randomBytes(32).toString("hex");
  const verificationCode = crypto
    .createHash("sha256")
    .update(verifyCode)
    .digest("hex");

  const user = await UserService.createUser({
    name: req.body.name,
    email: req.body.email.toLowerCase(),
    password: hashedPassword,
    verificationCode,
  });

  await publishEmail("email.verify", {
    to: user.email,
    subject: "Verify your email",
    templateName: "verify-email",
    templateData: {
      name: user.name,
      redirectUrl: `${process.env.ORIGIN}/auth/verifyemail/${verifyCode}`,
    },
  });

  res.status(201).json({
    status: "success",
    message:
      "Verification email sent. Check your inbox to complete the process.",
  });
};

const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  const user = await UserService.findUniqueUser(
    { email: email.toLowerCase() },
    { _id: true, email: true, verified: true, password: true }
  );

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(400, "Invalid email or password.");
  }

  if (!user.verified) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid email or password.",
    });
  }

  const { access_token, refresh_token } = await UserService.signTokens(user);

  res.status(200).json({
    status: "success",
    access_token,
    refresh_token,
  });
};

const logout = async (req: Request, res: Response) => {
  // Implement logout logic by invalidating the refresh token, if needed
  // Example: removing refresh token from storage or database

  res.status(200).json({
    status: "success",
    message: "Successfully logged out",
  });
};

const verifyEmail = async (req: Request, res: Response) => {
  const verificationCode = crypto
    .createHash("sha256")
    .update(req.body.verificationCode)
    .digest("hex");

  const user = await UserService.findUser({ verificationCode });

  if (!user) {
    throw new ApiError(401, "Invalid or expired verification code");
  }

  await UserService.updateUser(
    { _id: user.id },
    { verified: true, verificationCode: undefined }
  );

  res.status(200).json({
    status: "success",
    message: "Email verified successfully",
  });
};

const forgotPassword = async (req: Request, res: Response) => {
  const genericMessage =
    "If a user with that email exists and is verified, you will receive a password reset email shortly.";

  const email = req.body.email?.toLowerCase().trim();
  const user = await UserService.findUser({ email });

  if (!user || !user.verified) {
    console.log(`Password reset attempted for non-existent user: ${email}`);
    return res.status(200).json({ status: "success", message: genericMessage });
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  await UserService.updateUser(
    { _id: user.id },
    {
      passwordResetToken: hashedToken,
      passwordResetAt: new Date(Date.now() + 10 * 60 * 1000),
    },
    { email: true }
  );

  const resetUrl = `${process.env.ORIGIN}/auth/resetpassword/${rawToken}`;

  await publishEmail("email.reset", {
    to: user.email,
    subject: "Reset your password",
    templateName: "reset-password",
    templateData: {
      name: user.name,
      resetUrl,
    },
  });

  res.status(200).json({
    status: "success",
    message: genericMessage,
  });
};

const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await UserService.findUser({
    passwordResetToken: hashedToken,
  });

  if (
    !user ||
    !user.passwordResetAt ||
    user.passwordResetAt.getTime() < Date.now()
  ) {
    throw new ApiError(400, "Reset token is invalid or has expired.");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await UserService.updateUser(
    { _id: user.id },
    {
      password: hashedPassword,
      passwordResetToken: undefined,
      passwordResetAt: undefined,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Password has been reset successfully.",
  });
};

const resendVerificationEmail = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { email } = req.body;

  const user = await UserService.findUniqueUser(
    { email: email.toLowerCase() },
    { id: true, email: true, verified: true, name: true }
  );

  if (user && !user.verified) {
    const verifyCode = crypto.randomBytes(32).toString("hex");
    const verificationCode = crypto
      .createHash("sha256")
      .update(verifyCode)
      .digest("hex");

    await UserService.updateUser({ _id: user.id }, { verificationCode });

    await publishEmail("email.verify", {
      to: user.email,
      subject: "Verify your email",
      templateName: "verify-email",
      templateData: {
        name: user.name,
        redirectUrl: `${process.env.ORIGIN}/auth/verifyemail/${verifyCode}`,
      },
    });
  }

  return res.status(200).json({
    success: true,
    message: "If your account needs verification, a link will be sent.",
  });
};

const AuthController = {
  register: asyncHandler(register),
  login: asyncHandler(login),
  logout: asyncHandler(logout),
  verifyEmail: asyncHandler(verifyEmail),
  forgotPassword: asyncHandler(forgotPassword),
  resetPassword: asyncHandler(resetPassword),
  resendVerificationEmail: asyncHandler(resendVerificationEmail),
};

export default AuthController;
