"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_service_js_1 = __importDefault(require("../services/response.service.js"));
const helper_js_1 = __importDefault(require("../database/helper.js"));
const transactionRequest_1 = __importDefault(require("../requests/transactionRequest"));
class transaction extends transactionRequest_1.default {
    constructor() {
        super(...arguments);
        this.create = async (req, res, next) => {
            try {
                await this.transactionCheck(req, res);
                const body = req.body;
                //const user=authservice.getUser(req,res);
                if (body.type != 'credit' && body.type != 'debit')
                    return response_service_js_1.default.respond(res, {}, 412, false, 'Invalid type');
                // save the transaction, if it is debit, reduce balance in savings, if it is credit, add to balance
                //balance is sufficient
                const balance = await helper_js_1.default.select('wallet', ['balance'], [{ user_id: body.user_id }], "AND");
                if (balance.length == 0)
                    return response_service_js_1.default.respond(res, {}, 412, false, 'User has no waller');
                if (parseInt(balance[0].balance) < parseInt(body.amount) && body.type == 'debit')
                    return response_service_js_1.default.respond(res, {}, 412, false, 'Insufficient balance');
                //save transaction and update balance
                body['user_id'] = body.user_id;
                await helper_js_1.default.insert('transactions', body);
                const ball = parseInt(balance[0].balance);
                const bal = body.type == 'debit' ? Math.ceil(ball - parseInt(body.amount)) : Math.ceil(ball + parseInt(body.amount));
                await helper_js_1.default.update('wallet', { balance: bal }, { user_id: body.user_id });
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
                const body = req.body;
                //const user=authservice.getUser(req,res);
                //get the user transaction
                const where = body.id ? [{ id: body.id, user_id: body.user_id }] : [{ user_id: body.user_id }];
                const transactions = await helper_js_1.default.select('transactions', [], where, 'AND');
                const message = transactions.length == 0 ? 'No transaction found' : 'Transaction request successful';
                response_service_js_1.default.respond(res, transactions, 201, true, message);
            }
            catch (error) {
                response_service_js_1.default.respond(res, error.data ? error.data : error, error.code && typeof error.code == 'number' ? error.code : 500, false, error.message ? error.message : 'Server error');
            }
        };
    }
}
exports.default = new transaction();
//# sourceMappingURL=transaction.controller.js.map