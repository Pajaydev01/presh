"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_service_js_1 = __importDefault(require("../services/response.service.js"));
const actionService_js_1 = __importDefault(require("../services/actionService.js"));
const config_js_1 = require("../config/config.js");
const notificationRequests_js_1 = __importDefault(require("../requests/notificationRequests.js"));
class notifcation extends notificationRequests_js_1.default {
    constructor() {
        super(...arguments);
        this.sendMail = async (req, res, next) => {
            try {
                await this.emailCheck(req, res);
                //send the mail here
                const body = req.body;
                //console.log(body.multiple)
                if (body['multiple']) {
                    if (typeof (body.to) == 'string') {
                        response_service_js_1.default.respond(res, {}, 412, false, 'For multiple send out, please pass emails as list of arrays');
                        return;
                    }
                    const send = await actionService_js_1.default.sendMail(body.to, body.message, body.subject);
                    response_service_js_1.default.respond(res, {}, 200, true, 'Email request completed successfully');
                    return;
                }
                if (typeof (body.to) != 'string') {
                    response_service_js_1.default.respond(res, {}, 412, false, 'For single sendout, email has to be in string');
                    return;
                }
                const send = await actionService_js_1.default.sendMail(body.to, body.message, body.subject);
                //return response
                response_service_js_1.default.respond(res, {}, 200, true, 'Email request completed successfully');
            }
            catch (error) {
                response_service_js_1.default.respond(res, error.data ? error.data : error, error.code && typeof error.code == 'number' ? error.code : 500, false, error.message ? error.message : 'Server error');
            }
        };
        this.sendSms = async (req, res, next) => {
            try {
                await this.smsCheck(req, res);
                const request = req.body;
                let phone;
                let no = request.phone.toString();
                switch (no.charAt(0)) {
                    case "0":
                        phone = '234' + no.substr(1);
                        break;
                    case "+":
                        phone = no.substr(1);
                        break;
                    default:
                        phone = '234' + no;
                }
                ;
                //make the headers
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': config_js_1.config.SMS_KEY,
                    Accept: 'application/json',
                };
                const body = {
                    "from": request.from,
                    "to": phone,
                    "text": request.text
                };
                //console.log(body)
                const send = await actionService_js_1.default.makeRequest(config_js_1.config.SMS_URL, 'POST', body, headers);
                // console.log(send)
                response_service_js_1.default.respond(res, {}, 200, true, 'Sms sent successfully');
            }
            catch (error) {
                response_service_js_1.default.respond(res, error.data ? error.data : error, error.code && typeof error.code == 'number' ? error.code : 500, false, error.message ? error.message : 'Server error');
            }
        };
    }
}
exports.default = new notifcation();
//# sourceMappingURL=notification.controller.js.map