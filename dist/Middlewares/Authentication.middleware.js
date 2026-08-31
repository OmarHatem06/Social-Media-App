import { RoleEnum, TokenTypeEnum, } from "../Utils/enums/user.enums.js";
import { getSignature, verifyToken } from "../Utils/tokens/tokens.js";
import { UserModel } from "../DB/models/User.model.js";
export const decodeToken = async ({ Authorization, TokenType, }) => {
    const [Bearer, token] = Authorization.split(" ") || [];
    const signature = getSignature({
        TokenType: TokenType === TokenTypeEnum.ACCESS
            ? TokenTypeEnum.ACCESS
            : TokenTypeEnum.REFRESH,
        Role: Bearer === RoleEnum.ADMIN ? RoleEnum.ADMIN : RoleEnum.USER,
    });
    const decoded = verifyToken({
        Token: token,
        SecretKey: Bearer === RoleEnum.ADMIN
            ? signature.AdminSignature
            : signature.UserSignature,
    });
    const user = await UserModel.findOne({ _id: decoded._id });
    return { user, decoded };
};
export const Authentication = ({ TokenType }) => {
    return async (req, res, next) => {
        const { user, decoded } = await decodeToken({
            Authorization: req.headers.authorization,
            TokenType,
        });
        req.user = user;
        req.decoded = decoded;
        next();
    };
};
