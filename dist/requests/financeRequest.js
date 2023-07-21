"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = __importDefault(require("./main"));
class fincanceRequest extends main_1.default {
    constructor() {
        super(...arguments);
        this.createVACheck = (req, res) => {
            return new Promise((resolve, reject) => {
                const required = [
                    'firstname',
                    'lastname',
                    'bvn',
                    'dob',
                    'user_id'
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
        this.checkoutCheck = (req, res) => {
            return new Promise((resolve, reject) => {
                const required = [
                    'customername',
                    'amount',
                    'email',
                    'user_id'
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
        this.accountCheck = (req, res) => {
            return new Promise((resolve, reject) => {
                const required = [
                    'user_id'
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
        this.confirmCheck = (req, res) => {
            return new Promise((resolve, reject) => {
                const required = [
                    'reference',
                    'user_id'
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
exports.default = fincanceRequest;
//# sourceMappingURL=financeRequest.js.map