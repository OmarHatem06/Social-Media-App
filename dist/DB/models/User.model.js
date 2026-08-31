import { string } from "zod";
import { GenderEnum, RoleEnum } from "../../Utils/enums/user.enums.js";
import mongoose, { Schema, Types } from "mongoose";
import { GenerateHash } from "../../Utils/Hashing/hash.js";
export const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        minlength: [2, "minimum letters are two"],
        maxlength: [25, "maximum letters are two"],
        lowercase: true,
        unique: true,
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
    friends: [{ type: Schema.Types.ObjectId }],
    blockedUsers: [{ type: Schema.Types.ObjectId }],
    blockedBy: [{ type: Schema.Types.ObjectId }],
}, { timestamps: true, toObject: { virtuals: true } });
UserSchema.index({ username: 1 });
UserSchema.pre("save", async function () {
    if (this.isModified("password") && this.password) {
        this.password = String(await GenerateHash(this.password));
    }
    if (this.isModified("ConfirmEmailOTP") && this.ConfirmEmailOTP) {
        this.ConfirmEmailOTP = String(await GenerateHash(this.ConfirmEmailOTP));
    }
});
export const UserModel = mongoose.model("Users", UserSchema);
