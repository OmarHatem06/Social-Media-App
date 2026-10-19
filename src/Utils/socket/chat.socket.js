import ConversationModel from "../../DB/Models/conversation.model.js";
import { messageModel } from "../../DB/Models/messages.Models.js";
import UserModel from "../../DB/Models/User.Models.js";
import { BadRequestException } from "../responses/error.response.js";

export const getChatPartner = async (otherId) => {
  const other = await UserModel.findById(otherId);
  if (!other) throw BadRequestException("reciever not found");
  return other;
};

export const findorcreateConversation = async (userA, userB) => {
  const existing = await ConversationModel.findOne({
    participants: { $all: [userA, userB] },
  });
  if (existing) return existing;
  return await ConversationModel.create({
    participants: [userA, userB],
  });
};

export const registerChat = (io, socket) => {
  const user = socket.user;
  const conversationRoom = (conversationId) => conversationId.toString();

  socket.on("getmessages", async ({ data }, ack) => {
    try {
      const reciever = await getChatPartner(data.to);
      const conversation = await findorcreateConversation(
        user._id,
        reciever._id,
      );
      socket.join(conversationRoom(conversation._id));
      const messages = await messageModel
        .find({ conversationId: conversation._id })
        .sort({ createdAt: 1 });
      if (typeof ack === "function") {
        ack({ status: "ok", data: messages, myUserId: user._id });
      }
    } catch (error) {
      console.log(error);
      if (typeof ack === "function") {
        ack({ status: "error", error: error.message });
      }
    }
  });

  socket.on("sendmessage", async ({ data }, ack) => {
    try {
      const reciever = await getChatPartner(data.to);
      const conversation = await findorcreateConversation(user._id, reciever._id);
      const message = await messageModel.create({
        senderId: user._id,
        recieverId: reciever._id,
        content: data.content,
        conversationId: conversation._id,
      });

      await ConversationModel.updateOne(
        { _id: conversation._id },
        {
          lastmessage: message.content,
          lastmessageBy: user._id,
          lastmessageAt: message.createdAt,
        },
      );

      socket.join(conversationRoom(conversation._id));

      const payload = {
        id: message._id,
        messageId: message._id,
        conversationId: conversation._id,
        content: message.content,
        senderId: user._id,
        senderName: user.Username,
        recieverId: reciever._id,
        createdAt: message.createdAt,
      };

      io.to(reciever._id.toString()).emit("receivemessage", {
        data: payload,
      });

      if (typeof ack === "function") {
        ack({ status: "ok", data: payload });
      }
    } catch (error) {
      console.log(error);
      if (typeof ack === "function") {
        ack({ status: "error", error: error.message });
      }
    }
  });
};
