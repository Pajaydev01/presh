import dotenv from "dotenv";
import { env } from "process";
/////connect to the db from env
dotenv.config()
export const config={
    ENVIRONMENT:process.env.ENVIRONMENT,
    SECRET:process.env.SECRET,
    HOST:process.env.HOST,
    USERNAME:process.env.USERNAME,
    PASSWORD:process.env.PASSWORD,
    DATABASE:process.env.DB,
    EMAIL_HOST:process.env.EMAIL_HOST,
    EMAIL_USER:process.env.EMAIL_USER,
    EMAIL_PASS:process.env.EMAIL_PASS,
    SMS_URL:process.env.SMS_URL,
    SMS_KEY:process.env.SMS_KEY,
    PORT:process.env.PORT,
    FINCRA_TEST_URL:process.env.FINCRA_TEST_URL,
    FINCRA_LIVE_URL:process.env.FINCRA_TEST_URL,
    FINCRA_TEST_API_KEY:process.env.FINCRA_TEST_API_KEY,
    FINCRA_LIVE_API_KEY:process.env.FINCRA_LIVE_API_KEY,
    FINCRA_CHANNEL:process.env.FINCRA_CHANNEL,
    FINCRA_PUBLIC_KEY_TEST:process.env.FINCRA_PUBLIC_KEY_TEST,
    FINCRA_PUBLIC_KEY_LIVE:process.env.FINCRA_PUBLIC_KEY_LIVE,
    FINCRA_BUSINESS:process.env.FINCRA_BUSINESS
};