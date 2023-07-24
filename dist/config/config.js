"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
/////connect to the db from env
dotenv_1.default.config();
exports.config = {
    ENVIRONMENT: process.env.ENVIRONMENT,
    SECRET: process.env.SECRET,
    HOST: process.env.DB_HOST,
    USERNAME: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD,
    DATABASE: process.env.DB,
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    SMS_URL: process.env.SMS_URL,
    SMS_KEY: process.env.SMS_KEY,
    PORT: process.env.PORT,
    FINCRA_TEST_URL: process.env.FINCRA_TEST_URL,
    FINCRA_LIVE_URL: process.env.FINCRA_TEST_URL,
    FINCRA_TEST_API_KEY: process.env.FINCRA_TEST_API_KEY,
    FINCRA_LIVE_API_KEY: process.env.FINCRA_LIVE_API_KEY,
    FINCRA_CHANNEL: process.env.FINCRA_CHANNEL,
    FINCRA_PUBLIC_KEY_TEST: process.env.FINCRA_PUBLIC_KEY_TEST,
    FINCRA_PUBLIC_KEY_LIVE: process.env.FINCRA_PUBLIC_KEY_LIVE,
    FINCRA_BUSINESS: process.env.FINCRA_BUSINESS
};
//# sourceMappingURL=config.js.map