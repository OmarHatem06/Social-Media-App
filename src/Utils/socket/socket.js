import { Server, Socket } from "socket.io";
import { decodedToken } from "../../Middlewares/Authentication.middleware.js";
import { TokenTypeEnum } from "../Enums/Enum.js";
import { registerChat } from "./chat.socket.js";
import { addConnection, removeConnection } from "./connected.users.js";
export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: "*",
  });

  io.use(async (socket, next) => {
    try {
      const authorization = socket.handshake.auth.token;
      const { user } = await decodedToken({
        authorization,
        TokenType: TokenTypeEnum.ACCESS,
      });
      socket.user = user;
      next();
    } catch (error) {
      console.log(error);
      next(new Error("not authenticated"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.user;
    const userId = user._id.toString();
    console.log(`socket connected: ${user.Username} ${socket.id}`);
    socket.join(userId);

    const isFirst = addConnection(userId, socket.id);
    if (isFirst) {
      io.emit("userOnlineStatus", { userId, online: true });
    }

    registerChat(io, socket);

    socket.on("disconnect", () => {
      const isLast = removeConnection(userId, socket.id);
      console.log(`socket disconnected: ${user.Username} ${socket.id}`);
      if (isLast) {
        io.emit("userOnlineStatus", { userId, online: false });
      }
    });
  });
  console.log("socket is ready");
  return io;
};
