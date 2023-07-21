"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class handle extends Error {
    constructor() {
        super(...arguments);
        this.respond = (response, data, code, success, message, token = null) => {
            const resp = token ? {
                success: success,
                message,
                data,
                token
            } : {
                success: success,
                message,
                data
            };
            return response.status(code).json(resp);
        };
    }
}
exports.default = new handle();
//# sourceMappingURL=response.service.js.map