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
const notification_controller_js_1 = __importDefault(require("../controllers/notification.controller.js"));
const finance_controller_js_1 = __importDefault(require("../controllers/finance.controller.js"));
const special_controller_js_1 = __importDefault(require("../controllers/special.controller.js"));
///middleware
const authservice_js_1 = __importDefault(require("../services/authservice.js"));
const chats_controller_js_1 = __importDefault(require("../controllers/chats.controller.js"));
////////import controllers here////////////////
//////define routes here /////////////////////////
router.post("/register", login_js_1.default.register);
router.post("/login", login_js_1.default.login);
router.post("/notification/sendEmail", authservice_js_1.default.authenticate, notification_controller_js_1.default.sendMail);
router.post("/notification/sendSms", authservice_js_1.default.authenticate, notification_controller_js_1.default.sendSms);
router.put("/user/uploadFile", authservice_js_1.default.authenticate, user_controller_js_1.default.uploadFile);
//////finance service//////
router.post("/finance/create", authservice_js_1.default.authenticate, finance_controller_js_1.default.createVirtualAccount);
router.get("/finance/create", authservice_js_1.default.authenticate, finance_controller_js_1.default.getVirtualAccount);
router.post("/finance/checkout", authservice_js_1.default.authenticate, finance_controller_js_1.default.createCheckout);
router.patch("/finance/checkout", authservice_js_1.default.authenticate, finance_controller_js_1.default.confirmCheckout);
router.get("/finance/bulkCheck", authservice_js_1.default.authenticate, finance_controller_js_1.default.MultiResolve);
router.post("/transaction/create", authservice_js_1.default.authenticate, transaction_controller_js_1.default.create);
router.get("/transaction/get", authservice_js_1.default.authenticate, transaction_controller_js_1.default.getAllTransactions);
//delete file 
router.delete("/user/uploadFile", authservice_js_1.default.authenticate, user_controller_js_1.default.delFiles);
//special check service
router.post("/special/checkface", authservice_js_1.default.authenticate, special_controller_js_1.default.doFaceCheck);
//////use auth middleware here /////////
router.get("/me", authservice_js_1.default.authorize, user_controller_js_1.default.getUser);
router.patch("/me", authservice_js_1.default.authorize, user_controller_js_1.default.updateUser);
///////////////chats/////////////////////
router.get("/chats", authservice_js_1.default.authenticate, chats_controller_js_1.default.load);
///////create api user
router.post("/users/create", user_controller_js_1.default.makeUser);
//# sourceMappingURL=route.js.map