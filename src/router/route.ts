import express from "express";
const router = express.Router();
import login from '../controllers/login.js'
import userController from "../controllers/user.controller.js";
import transactionController from "../controllers/transaction.controller.js";
///middleware
import authservice from "../services/authservice.js";

////////import controllers here////////////////

//////define routes here /////////////////////////
router.post("/register", login.register);
router.post("/login", login.login);

router.get("/user", authservice.authorize, userController.getUser);
router.get("/user/bank", authservice.authorize, userController.checkWallet);
router.post("/user/bank", authservice.authorize, userController.saveBank);

////transaction
router.get('/transaction/details', authservice.authorize, transactionController.getDetails);
router.post('/transaction/create', authservice.authorize, transactionController.create);
router.post('/transaction/withdraw', authservice.authorize, transactionController.withdraw);
export { router };

