"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionService_1 = __importDefault(require("../services/actionService"));
const specialRequest_1 = __importDefault(require("../requests/specialRequest"));
const response_service_1 = __importDefault(require("../services/response.service"));
class specialContoller extends specialRequest_1.default {
    constructor() {
        super(...arguments);
        this.doFaceCheck = async (req, res, next) => {
            try {
                await this.veryfyCheck(req, res);
                const run = await actionService_1.default.detectFace(req.body.file);
                // console.log(run)
                const remark = {};
                remark['score'] = run?._score ? run._score : 0;
                if (remark['score'] != 0) {
                    remark['comment'] = remark['score'] <= 0.95 ? 'poor' : (remark['score'] > 0.95 && remark['score'] <= 0.97) ? 'retake' : 'good';
                }
                else {
                    remark['comment'] = 'no face';
                }
                response_service_1.default.respond(res, remark, 200, true, 'Face check completed');
            }
            catch (error) {
                response_service_1.default.respond(res, error.data ? error.data : error, error.code && typeof error.code == 'number' ? error.code : 500, false, error.message ? error.message : 'Server error');
            }
        };
    }
}
exports.default = new specialContoller();
//# sourceMappingURL=special.controller.js.map