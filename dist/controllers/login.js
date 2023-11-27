"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const registerRequest_js_1 = __importDefault(require("../requests/registerRequest.js"));
const response_service_js_1 = __importDefault(require("../services/response.service.js"));
const helper_js_1 = __importDefault(require("../database/helper.js"));
const jsontoken = __importStar(require("jsonwebtoken"));
const config_js_1 = require("../config/config.js");
const actionService_js_1 = __importDefault(require("../services/actionService.js"));
;
class login extends registerRequest_js_1.default {
    constructor() {
        super(...arguments);
        this.register = async (req, res, next) => {
            try {
                const body = req.body;
                //run check for required
                await this.registerCheck(req, res);
                //check if email or phone exists
                const checker = await helper_js_1.default.select('users', [], [{ mail: body.mail }], 'AND');
                if (checker.length > 0)
                    return response_service_js_1.default.respond(res, {}, 412, false, 'The selected email or phone number already exists');
                //hash password
                const hash = await actionService_js_1.default.hasher(body.password);
                body['password'] = hash.hash;
                body['salt'] = hash.salt;
                const saver = await helper_js_1.default.insert('users', body);
                //get the user and insert saving
                await helper_js_1.default.insert('details', { mail: body.mail });
                //create user token
                //return success
                const user = await helper_js_1.default.select('users', [], [{ mail: body.mail }], 'AND');
                delete user[0].password;
                delete user[0].salt;
                const token = jsontoken.sign({ ...user[0] }, config_js_1.config.SECRET, {
                    expiresIn: 86400 // expires in 24 hours
                });
                response_service_js_1.default.respond(res, {}, 200, true, 'Registeration successful', token);
            }
            catch (error) {
                //console.log(error.code)
                response_service_js_1.default.respond(res, error.data ? error.data : error, error.code && typeof error.code == 'number' ? error.code : 500, false, error.message ? error.message : 'Server error');
            }
        };
        this.login = async (req, res, next) => {
            try {
                const body = req.body;
                await this.loginCheck(req, res);
                //checker
                const checker = await helper_js_1.default.select('users', [], [{ mail: body.email }], 'AND');
                if (checker.length == 0)
                    return response_service_js_1.default.respond(res, {}, 404, false, 'Invalid email');
                //proceed
                const check = await actionService_js_1.default.compare(checker[0].password, body.password, checker[0].salt);
                if (!check)
                    return response_service_js_1.default.respond(res, {}, 412, false, 'Invalid email or password');
                //proceed to login and generate token
                //return success
                delete checker[0].password;
                delete checker[0].salt;
                const token = jsontoken.sign({ ...checker[0] }, config_js_1.config.SECRET, {
                    expiresIn: 86400 // expires in 24 hours
                });
                response_service_js_1.default.respond(res, { ...checker[0] }, 200, true, 'login successful', token);
            }
            catch (error) {
                console.log(error);
                response_service_js_1.default.respond(res, error.data ? error.data : error, error.code && typeof error.code == 'number' ? error.code : 500, false, error.message ? error.message : 'Server error');
            }
        };
    }
}
exports.default = new login();
//# sourceMappingURL=login.js.map