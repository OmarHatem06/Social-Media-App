import type { IUser } from "../../DB/models/User.model.js";
import type { TokenPayload } from "../enums/user.enums.js";

// Makes req.user / req.decoded available everywhere after authentication
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      decoded?: TokenPayload;
      file?: Express.Multer.File;
    }

    namespace Multer {
      interface File {
        finalPath?: string;
      }
    }
  }
}

export {};
