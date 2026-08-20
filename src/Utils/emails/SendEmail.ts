import Mail, { type SendMailOptions } from "nodemailer";
import { createTransport } from "nodemailer";
import { env } from "../../Config/config.service.js";
import type { MailOptions } from "nodemailer/lib/json-transport/index.js";

export const SendEmail = async (data: SendMailOptions): Promise<void> => {
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: env.USEREMAIL,
      pass: env.EMAILPASS,
    },
  });
  await transporter.sendMail({
    ...data,
    from: `"Social Media App"<${env.USEREMAIL}>`,
  });
};
