"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionService_1 = __importDefault(require("./actionService"));
const config_1 = require("../config/config");
class financeService {
    header() {
        const key = config_1.config.ENVIRONMENT == 'TEST' ? config_1.config.FINCRA_TEST_API_KEY : config_1.config.FINCRA_LIVE_API_KEY;
        const header = {
            "accept": "application/json",
            "content-type": "application/json",
            "api-key": key
        };
        return header;
    }
    //virtual account creation first
    async createVirtualAccount(firsname, lastname, bvn, dob) {
        return new Promise(async (resolve, reject) => {
            try {
                const url = config_1.config.ENVIRONMENT == "TEST" ? config_1.config.FINCRA_TEST_URL + 'profile/virtual-accounts/requests' : config_1.config.FINCRA_LIVE_URL + 'profile/virtual-accounts/requests';
                const payload = {
                    "currency": "NGN",
                    "accountType": "individual",
                    "KYCInformation": {
                        "firstName": firsname,
                        "lastName": lastname,
                        "bvn": bvn
                    },
                    "dateOfBirth": dob,
                    "channel": config_1.config.FINCRA_CHANNEL
                };
                //make the call
                const call = await actionService_1.default.makeRequest(url, 'POST', payload, this.header());
                // console.log(call)
                resolve(call);
            }
            catch (error) {
                //  console.log(error)
                reject(error);
            }
        });
    }
    async createCheckout(amount, customer, email) {
        return new Promise(async (resolve, reject) => {
            try {
                const url = config_1.config.ENVIRONMENT == "TEST" ? config_1.config.FINCRA_TEST_URL + 'checkout/payments' : config_1.config.FINCRA_LIVE_URL + 'checkout/payments';
                const headers = this.header();
                headers['x-pub-key'] = config_1.config.ENVIRONMENT == "TEST" ? config_1.config.FINCRA_PUBLIC_KEY_TEST : config_1.config.FINCRA_PUBLIC_KEY_LIVE;
                headers['x-business-id'] = config_1.config.FINCRA_BUSINESS;
                const payload = {
                    "currency": "NGN",
                    "customer": {
                        "name": customer,
                        "email": email
                    },
                    "amount": amount
                };
                //make request
                const request = await actionService_1.default.makeRequest(url, 'POST', payload, headers);
                resolve(request);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async confirmCheckout(reference, multiple = false) {
        return new Promise(async (resolve, reject) => {
            const header = this.header();
            header['x-business-id'] = config_1.config.FINCRA_BUSINESS;
            try {
                if (multiple) {
                    //bundle all the request here
                    const requests = [];
                    reference.forEach((res) => {
                        const url = config_1.config.ENVIRONMENT == "TEST" ? config_1.config.FINCRA_TEST_URL + `checkout/payments/merchant-reference/${res.reference}` : config_1.config.FINCRA_LIVE_URL + `checkout/payments/merchant-reference/${res.reference}`;
                        requests.push(actionService_1.default.makeRequest(url, 'GET', {}, header));
                    });
                    Promise.all(requests).then(res => {
                        // console.log(res)
                        resolve(res);
                        return;
                    }).catch(err => {
                        reject(err);
                        return;
                    });
                }
                else {
                    const url = config_1.config.ENVIRONMENT == "TEST" ? config_1.config.FINCRA_TEST_URL + `checkout/payments/merchant-reference/${reference}` : config_1.config.FINCRA_LIVE_URL + `checkout/payments/merchant-reference/${reference}`;
                    //console.log(url)
                    //make the call
                    const request = await actionService_1.default.makeRequest(url, 'GET', {}, header);
                    resolve(request);
                }
            }
            catch (error) {
                reject(error);
            }
        });
    }
}
exports.default = new financeService();
//# sourceMappingURL=financeservice.js.map