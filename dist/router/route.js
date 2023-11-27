"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.router = router;
const login_js_1 = __importDefault(require("../controllers/login.js"));
const user_controller_js_1 = __importDefault(require("../controllers/user.controller.js"));
const transaction_controller_js_1 = __importDefault(require("../controllers/transaction.controller.js"));
///middleware
const authservice_js_1 = __importDefault(require("../services/authservice.js"));
////////import controllers here////////////////
//////define routes here /////////////////////////
router.post("/register", login_js_1.default.register);
router.post("/login", login_js_1.default.login);
router.get("/user", authservice_js_1.default.authorize, user_controller_js_1.default.getUser);
////transaction
router.get('/transaction/details', authservice_js_1.default.authorize, transaction_controller_js_1.default.getDetails);
router.post('/transaction/create', authservice_js_1.default.authorize, transaction_controller_js_1.default.create);
//# sourceMappingURL=route.js.map