import { UserModel } from "../../DB/models/User.model.js";
import { BadRequestException } from "../../Utils/responses/error.response.js";
import { sendEmailEvent } from "../../Utils/Events/sendEmail.evens.js";
import { GenerateOTP } from "../../Utils/generateOTP/OTP.js";
import { GenerateHash, VerifyHash } from "../../Utils/Hashing/hash.js";
import { getCredintials } from "../../Utils/tokens/tokens.js";
class AuthService {
    constructor() { }
    signUp = async (req, res) => {
        const { username, email, password, ConfirmPassword } = req.body;
        const checkemail = await UserModel.findOne({ email }).select("email");
        if (checkemail) {
            throw new BadRequestException("email already exists");
        }
        const hashedPassword = await GenerateHash(password);
        const otp = GenerateOTP();
        const hashedotp = await GenerateHash(otp);
        console.log("otp", otp);
        const user = await UserModel.create({
            username,
            email,
            password: String(hashedPassword),
            ConfirmEmailOTP: String(hashedotp),
        });
        sendEmailEvent.emit("confirm email", {
            data: {
                to: email,
                email: email,
                username,
                otp,
                subject: "Confirm your email",
            },
        });
        if (!user) {
            throw new BadRequestException("user could not be created");
        }
        return res.status(201).json({
            message: "user created successfully",
            user,
        });
    };
    ConfirmEmail = async (req, res) => {
        const { email, otp } = req.body;
        const user = await UserModel.findOne({
            email,
            ConfirmEmailOTP: { $exists: true },
        });
        if (!user) {
            throw new BadRequestException("user not found");
        }
        if (!(await VerifyHash(otp, user.ConfirmEmailOTP))) {
            throw new BadRequestException("invalid otp");
        }
        await UserModel.updateOne({ email }, {
            $unset: { ConfirmEmailOTP: true },
            $set: { ConfirmedAt: Date.now() },
            $inc: { __v: 1 },
        });
        return res.status(200).json({ message: "Email Confirmed Successfully" });
    };
    login = async (req, res) => {
        const { email, password } = req.body;
        const user = await UserModel.findOne({
            email,
            ConfirmedAt: { $exists: true },
        });
        if (!user) {
            throw new BadRequestException("user not found");
        }
        const comparePass = await VerifyHash(password, user.password);
        if (!comparePass)
            throw new BadRequestException("password is incorrect");
        const token = await getCredintials(user);
        return res
            .status(200)
            .json({ message: "logged in successfully", token: token });
    };
}
export default new AuthService();
