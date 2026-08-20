import { string } from "zod";
import { GenderEnum, RoleEnum } from "../../Utils/enums/user.enums.js";
import mongoose, { Schema, type HydratedDocument } from "mongoose";
export interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  ConfirmEmailOTP?: string;
  ConfirmedAt?: Date;
  password: string;
  resetPasswordOTP?: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
  role: string;
  gender: string;
  username?: string;
  otp?: string;
}

export const UserSchema = new Schema<IUser>(
  {
    firstname: {
      type: String,
      required: true,
      minlength: [2, "minimum letters are two"],
      maxlength: [25, "maximum letters are two"],
      lowercase: true,
    },
    lastname: {
      type: String,
      required: true,
      minlength: [2, "minimum letters are two"],
      maxlength: [25, "maximum letters are two"],
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    ConfirmedAt: { type: Date },
    ConfirmEmailOTP: { type: String },
    gender: {
      type: String,
      enum: Object.values(GenderEnum),
      default: GenderEnum.MALE,
    },
    address: { type: String },
    password: { type: String, required: true },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    phone: { type: String },
    role: {
      type: String,
      enum: Object.values(RoleEnum),
      default: RoleEnum.USER,
    },
    resetPasswordOTP: {
      type: String,
    },
  },
  { timestamps: true, toObject: { virtuals: true } },
);

UserSchema.virtual("username")
  .set(function (value: string) {
    const [firstname, ...rest] = value.trim().split(/\s+/);
    this.set({ firstname, lastname: rest.join(" ") });
  })
  .get(function (this: IUser) {
    return `${this.firstname}${this.lastname}`;
  });
export const UserModel = mongoose.model("Users", UserSchema);
export type HUserDocument = HydratedDocument<IUser>;
