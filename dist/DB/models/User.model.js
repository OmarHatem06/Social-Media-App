import { string } from "zod";
import { GenderEnum, RoleEnum } from "../../Utils/enums/user.enums.js";
import mongoose, { Schema } from "mongoose";
export const UserSchema = new Schema({
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
}, { timestamps: true, toObject: { virtuals: true } });
UserSchema.virtual("username")
    .set(function (value) {
    const [firstname, ...rest] = value.trim().split(/\s+/);
    this.set({ firstname, lastname: rest.join(" ") });
})
    .get(function () {
    return `${this.firstname}${this.lastname}`;
});
export const UserModel = mongoose.model("Users", UserSchema);
