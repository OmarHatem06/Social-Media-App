import EventEmitter from "events";
import type { MailOptions } from "nodemailer/lib/json-transport/index.js";
import { generateOtpTemplate } from "../emails/HTMLtemplate.js";
import { BadRequestException } from "../responses/error.response.js";
import { SendEmail } from "../emails/SendEmail.js";

interface IEmail extends MailOptions {
  otp: string;
  username: string;
  email: string;
  html?: string;
}

export const sendEmailEvent = new EventEmitter();
sendEmailEvent.on("confirm email", async ({ data }: { data: IEmail }) => {
  try {
    data.html = generateOtpTemplate({
      firstname: data.username,
      email: data.email,
      otp: data.otp,
    });
    await SendEmail(data);
  } catch (error) {
    console.log(error);
  }
});
