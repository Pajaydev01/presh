"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = __importDefault(require("./main"));
class NotificationRequest extends main_1.default {
    constructor() {
        super(...arguments);
        this.emailCheck = (req, res) => {
            return new Promise((resolve, reject) => {
                const required = [
                    'to',
                    'subject',
                    'message'
                ];
                const check = this.run(req, required);
                let res;
                //console.log(check)
                if (!check) {
                    res = {
                        code: 400,
                        data: required,
                        message: "All fields are required"
                    };
                    reject(res);
                    //responseService.respond(res,required,400,false,"All fields are required");
                }
                else {
                    res = true;
                    resolve(res);
                }
            });
        };
        this.smsCheck = (req, res) => {
            return new Promise((resolve, reject) => {
                const required = [
                    'phone',
                    'text',
                    'from'
                ];
                const check = this.run(req, required);
                let res;
                //console.log(check)
                if (!check) {
                    res = {
                        code: 400,
                        data: required,
                        message: "All fields are required"
                    };
                    reject(res);
                    //responseService.respond(res,required,400,false,"All fields are required");
                }
                else {
                    res = true;
                    resolve(res);
                }
            });
        };
    }
}
exports.default = NotificationRequest;
//# sourceMappingURL=notificationRequests.js.map