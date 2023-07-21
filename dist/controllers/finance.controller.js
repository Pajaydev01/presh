"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//finance starts here
const financeservice_1 = __importDefault(require("../services/financeservice"));
const financeRequest_1 = __importDefault(require("../requests/financeRequest"));
const response_service_js_1 = __importDefault(require("../services/response.service.js"));
const helper_1 = __importDefault(require("../database/helper"));
class fincanceController extends financeRequest_1.default {
    constructor() {
        super(...arguments);
        this.createVirtualAccount = async (req, res, next) => {
            try {
                await this.createVACheck(req, res);
                //start
                const body = req.body;
                const request = await financeservice_1.default.createVirtualAccount(body.firstname, body.lastname, body.bvn, body.dob);
                // console.log(request)
                if (!request.success) {
                    response_service_js_1.default.respond(res, {}, 412, false, request.error);
                    return;
                }
                //check if the user already created and update
                const checker = await helper_1.default.select('wallet', ['user_id'], [{ user_id: body.user_id }]);
                //save into the db
                if (checker.length > 0) {
                    //update
                    const data = request.data.accountInformation;
                    data['virtualId'] = request.data._id;
                    const update = await helper_1.default.update('wallet', data, { user_id: body.user_id });
                    response_service_js_1.default.respond(res, request.data, 200, true, 'Request processed');
                    return;
                }
                const data = request.data.accountInformation;
                data['user_id'] = body.user_id;
                data['virtualId'] = request.data._id;
                data['balance'] = 0;
                await helper_1.default.insert('wallet', data);
                response_service_js_1.default.respond(res, request.data, 200, true, 'Request processed');
            }
            catch (error) {
                response_service_js_1.default.respond(res, error.data ? error.data : error, error.code && typeof error.code == 'number' ? error.code : 500, false, error.message ? error.message : 'Server error');
            }
        };
        this.getVirtualAccount = async (req, res) => {
            try {
                await this.accountCheck(req, res);
                //run
                const get = await helper_1.default.select('wallet', [], [{ user_id: req.body.user_id }]);
                response_service_js_1.default.respond(res, { ...get[0] }, 200, true, 'Account retrieved successfuly');
            }
            catch (error) {
                response_service_js_1.default.respond(res, error.data ? error.data : error, error.code && typeof error.code == 'number' ? error.code : 500, false, error.message ? error.message : 'Server error');
            }
        };
        this.createCheckout = async (req, res, next) => {
            try {
                await this.checkoutCheck(req, res);
                //start
                const request = req.body;
                const create = await financeservice_1.default.createCheckout(request.amount, request.customername, request.email);
                if (!create.status) {
                    response_service_js_1.default.respond(res, create, 412, false, 'An error occured');
                    return;
                }
                //save into checkouts as pending transaction
                //check if it exists before
                const check = await helper_1.default.select('checkouts', ['reference'], [{ reference: create.data.payCode, user_id: request.user_id }], 'AND');
                if (check.length > 0) {
                    response_service_js_1.default.respond(res, {}, 412, false, 'Duplicate transaction');
                    return;
                }
                //save now
                await helper_1.default.insert('checkouts', { user_id: request.user_id, amount: request.amount, status: false, reference: create.data.payCode });
                response_service_js_1.default.respond(res, create.data, 200, true, 'Request successsful');
            }
            catch (error) {
                response_service_js_1.default.respond(res, error.data ? error.data : error, error.code && typeof error.code == 'number' ? error.code : 500, false, error.message ? error.message : 'Server error');
            }
        };
        this.confirmCheckout = async (req, res) => {
            try {
                await this.confirmCheck(req, res);
                // start for single
                const request = req.body;
                //process single here
                const check = await helper_1.default.select('checkouts', [], [{ reference: request.reference, user_id: request.user_id }], 'AND');
                if (check.length == 0) {
                    response_service_js_1.default.respond(res, {}, 412, false, 'Transaction not found');
                    return;
                }
                //check the transaction
                const run = await financeservice_1.default.confirmCheckout(request.reference);
                if (run.data.status == 'success') {
                    //check if the status is not already marked as success
                    if (check[0].status != 0) {
                        response_service_js_1.default.respond(res, { payCode: run.data.reference, amount: run.data.amount, customer: run.data.customer }, 200, true, 'Transaction already completed');
                        return;
                    }
                    //first save into transaction
                    await helper_1.default.insert('transactions', { user_id: request.user_id, amount: run.data.amount, type: 'credit', description: 'Wallet top up via checkout', t_id: request.reference });
                    //add to the user balance
                    const get = await helper_1.default.select('wallet', ['balance'], [{ user_id: request.user_id }]);
                    const balance = get[0].balance;
                    await helper_1.default.update('wallet', { balance: (parseInt(balance) + parseInt(run.data.amount)) }, { user_id: request.user_id });
                    //mark the status as completed
                    await helper_1.default.update('checkouts', { status: true }, { reference: request.reference });
                    //send success
                    response_service_js_1.default.respond(res, { payCode: run.data.reference, amount: run.data.amount, customer: run.data.customer }, 200, true, 'Transaction completed');
                    return;
                }
                response_service_js_1.default.respond(res, { payCode: run.data.reference, amount: run.data.amount, customer: run.data.customer }, 201, false, 'Transaction pending');
            }
            catch (error) {
                response_service_js_1.default.respond(res, error.data ? error.data : error, error.code && typeof error.code == 'number' ? error.code : 500, false, error.message ? error.message : 'Server error');
            }
        };
        this.MultiResolve = async (req, res) => {
            const looper = async (items) => {
                return new Promise(async (resolve, reject) => {
                    const completed = [];
                    const pending = [];
                    const run = await financeservice_1.default.confirmCheckout(items, true);
                    //console.log(run.length)
                    run.forEach(async (res, index) => {
                        if (res.data.status == 'success') {
                            completed.push('done');
                            //first save into transaction
                            //get that checkout
                            const gett = await helper_1.default.select('checkouts', ['user_id'], [{ reference: res.data.reference }]);
                            await helper_1.default.insert('transactions', { user_id: gett[0].user_id, amount: res.data.amount, type: 'credit', description: 'Wallet top up via checkout', t_id: res.data.reference });
                            //add to the user balance
                            const get = await helper_1.default.select('wallet', ['balance'], [{ user_id: gett[0].user_id }]);
                            const balance = get[0].balance;
                            await helper_1.default.update('wallet', { balance: (parseInt(balance) + parseInt(res.data.amount)) }, { user_id: gett[0].user_id });
                            //mark the status as completed
                            await helper_1.default.update('checkouts', { status: true }, { reference: res.data.reference });
                            //pass in to the completed array
                            //console.log(res.reference)
                        }
                        else {
                            // console.log(pending)
                            //push into the incomplete
                            pending.push('done');
                        }
                    });
                    resolve({ completed: completed, pending: pending });
                });
            };
            try {
                //first get all the pending requests and run them 
                const get = await helper_1.default.select('checkouts', ['reference', 'user_id'], [{ status: 0 }]);
                if (get.length == 0) {
                    response_service_js_1.default.respond(res, {}, 200, false, 'No pending transactions found');
                    return;
                }
                //console.log(get)
                const getter = await looper(get);
                response_service_js_1.default.respond(res, { completed: getter.completed.length, pending: getter.pending.length }, 200, true, 'Operation complete');
            }
            catch (error) {
                response_service_js_1.default.respond(res, error.data ? error.data : error, error.code && typeof error.code == 'number' ? error.code : 500, false, error.message ? error.message : 'Server error');
            }
        };
    }
}
exports.default = new fincanceController();
//# sourceMappingURL=finance.controller.js.map