export interface IUser {
  email: string;
  name: string;
  password: string;
  verified: boolean;
  verificationCode?: string;
  passwordResetAt?: Date;
  passwordResetToken?: string;
}
