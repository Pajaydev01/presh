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
const config_js_1 = require("../config/config.js");
const jsontoken = __importStar(require("jsonwebtoken"));
const response_service_js_1 = __importDefault(require("./response.service.js"));
const helper_js_1 = __importDefault(require("../database/helper.js"));
class authservice {
    constructor() {
        this.authorize = (req, res, next) => {
            try {
                const token = req.headers['x-auth-token'];
                if (!token)
                    return response_service_js_1.default.respond(res, {}, 401, false, 'unauthenticated');
                jsontoken.verify(token, config_js_1.config.SECRET, (err, value) => {
                    if (err)
                        return response_service_js_1.default.respond(res, {}, 412, false, 'Invalid token');
                    next();
                });
            }
            catch (error) {
                response_service_js_1.default.respond(res, error.data ? error.data : error, error.code && typeof error.code == 'number' ? error.code : 500, false, error.message ? error.message : 'Server error');
            }
        };
        this.authenticate = async (req, res, next) => {
            try {
                const token = req.headers['x-api-key'];
                if (!token)
                    return response_service_js_1.default.respond(res, {}, 401, false, 'unauthenticated');
                //check the user api in the db
                const check = await helper_js_1.default.select('apiUsers', ['token'], [{ token: token }]);
                if (check.length == 0) {
                    return response_service_js_1.default.respond(res, {}, 401, false, 'Invalid token');
                }
                next();
            }
            catch (error) {
                response_service_js_1.default.respond(res, error.data ? error.data : error, error.code && typeof error.code == 'number' ? error.code : 500, false, error.message ? error.message : 'Server error');
            }
        };
        //authorization for api key
        this.getUser = (req, res) => {
            try {
                let val;
                const token = req.headers['x-auth-token'];
                jsontoken.verify(token, config_js_1.config.SECRET, (err, value) => {
                    val = value;
                });
                return val;
            }
            catch (error) {
                response_service_js_1.default.respond(res, error.data ? error.data : error, error.code && typeof error.code == 'number' ? error.code : 500, false, error.message ? error.message : 'Server error');
            }
        };
    }
}
exports.default = new authservice();
//# sourceMappingURL=authservice.js.map