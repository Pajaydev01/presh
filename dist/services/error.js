"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class error extends Error {
    constructor(message, statusCode) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.status = 200;
        //  Error.captureStackTrace(this,this.constructor);
        // Error.prepareStackTrace(this.message,)
    }
}
const throwError = (message, code) => {
    throw new error(message, code);
};
exports.default = throwError;
//# sourceMappingURL=error.js.map