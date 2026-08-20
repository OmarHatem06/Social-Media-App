import EventEmitter from "events";
import { generateOtpTemplate } from "../emails/HTMLtemplate.js";
import { BadRequestException } from "../responses/error.response.js";
import { SendEmail } from "../emails/SendEmail.js";
export const sendEmailEvent = new EventEmitter();
sendEmailEvent.on("confirm email", async ({ data }) => {
    try {
        data.html = generateOtpTemplate({
            firstname: data.username,
            email: data.email,
            otp: data.otp,
        });
        await SendEmail(data);
    }
    catch (error) {
        console.log(error);
    }
});
