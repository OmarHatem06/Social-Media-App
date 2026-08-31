import { v2 as cloudinary } from "cloudinary";
import { env } from "../../Config/config.service.js";
cloudinary.config({
    api_key: env.API_KEY,
    api_secret: env.API_SECRET,
    cloud_name: env.CLOUDE_NAME,
});
export default cloudinary;
