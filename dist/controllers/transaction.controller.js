"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_service_js_1 = __importDefault(require("../services/response.service.js"));
const helper_js_1 = __importDefault(require("../database/helper.js"));
const authservice_js_1 = __importDefault(require("../services/authservice.js"));
const transactionRequest_1 = __importDefault(require("../requests/transactionRequest"));
class transaction extends transactionRequest_1.default {
    constructor() {
        super(...arguments);
        this.create = async (req, res, next) => {
            try {
                await this.transactionCheck(req, res);
                const body = req.body;
                const user = await authservice_js_1.default.getUser(req, res);
                //const user=authservice.getUser(req,res);
                if (body.type != 'credit' && body.type != 'debit')
                    return response_service_js_1.default.respond(res, {}, 412, false, 'Invalid type');
                // save the transaction, if it is debit, reduce balance in savings, if it is credit, add to balance
                //balance is sufficient
                const balance = await helper_js_1.default.select('details', [body.field], [{ mail: user.mail }], "AND");
                if (parseInt(balance[0][body.field]) < parseInt(body.amount) && body.type == 'debit')
                    return response_service_js_1.default.respond(res, {}, 412, false, 'Insufficient balance');
                //save transaction and update balance
                body['mail'] = user.mail;
                const ball = balance[0][body.field] == '' || balance[0][body.field] == null ? 0 : parseInt(balance[0][body.field]);
                const bal = body.type == 'debit' ? Math.ceil(ball - parseInt(body.total)) : Math.ceil(ball + parseInt(body.total));
                const update = {};
                update[body.field] = bal;
                await helper_js_1.default.update('details', update, { mail: user.mail });
                const info = body;
                delete info['field'];
                await helper_js_1.default.insert('transaction', info);
                //instert to profit
                //done!
                response_service_js_1.default.respond(res, {}, 201, true, 'Transaction created');
            }
            catch (error) {
                response_service_js_1.default.respond(res, error.data ? error.data : error, error.code && typeof error.code == 'number' ? error.code : 500, false, error.message ? error.message : 'Server error');
            }
        };
        this.getAllTransactions = async (req, res, next) => {
            try {
                await this.getTransactionCheck(req, res);
                let body;
                if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                    if (req.query.constructor === Object && Object.keys(req.query).length === 0) {
                        body = {};
                    }
                    else {
                        body = req.query;
                    }
                }
                else {
                    body = req.body;
                }
                const user = authservice_js_1.default.getUser(req, res);
                //get the user transaction
                const where = body.id ? [{ sn: body.id, mail: user.mail }] : [{ mail: user.mail }];
                const transactions = await helper_js_1.default.select('transactions', [], where, 'AND', 'id', 'DESC');
                const message = transactions.length == 0 ? 'No transaction found' : 'Transaction request successful';
                response_service_js_1.default.respond(res, transactions, 201, true, message);
            }
            catch (error) {
                response_service_js_1.default.respond(res, error.data ? error.data : error, error.code && typeof error.code == 'number' ? error.code : 500, false, error.message ? error.message : 'Server error');
            }
        };
        this.getDetails = async (req, res, next) => {
            try {
                const user = authservice_js_1.default.getUser(req, res);
                const info = await helper_js_1.default.select('details', [], [{ mail: user.mail }]);
                response_service_js_1.default.respond(res, info, 200, true, 'User wallet retrieved');
            }
            catch (error) {
                response_service_js_1.default.respond(res, error.data ? error.data : error, error.code && typeof error.code == 'number' ? error.code : 500, false, error.message ? error.message : 'Server error');
            }
        };
    }
}
exports.default = new transaction();
//# sourceMappingURL=transaction.controller.js.map