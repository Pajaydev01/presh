"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = __importDefault(require("./main"));
class transactionReq extends main_1.default {
    constructor() {
        super(...arguments);
        this.transactionCheck = (req, res) => {
            return new Promise((resolve, reject) => {
                const required = [
                    'total',
                    'type',
                    'note',
                    'ref',
                    'phone',
                    'postCode',
                    'address',
                    'town',
                    'lname',
                    'fname',
                    'field'
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
        this.getTransactionCheck = (req, res) => {
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
        //create the requirement and call the super
    }
}
exports.default = transactionReq;
//# sourceMappingURL=transactionRequest.js.map