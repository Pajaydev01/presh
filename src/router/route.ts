import express from "express";
const router=express.Router();
import login from '../controllers/login.js'
import userController from "../controllers/user.controller.js";
import transactionController from "../controllers/transaction.controller.js";
import notificationController from "../controllers/notification.controller.js";
import financeController from "../controllers/finance.controller.js";
import specialController from "../controllers/special.controller.js";
///middleware
import authservice from "../services/authservice.js";

////////import controllers here////////////////

//////define routes here /////////////////////////
router.post("/register",login.register);
router.post("/login",login.login);
router.post("/notification/sendEmail",authservice.authenticate,notificationController.sendMail);
router.post("/notification/sendSms",authservice.authenticate,notificationController.sendSms);
router.put("/user/uploadFile",authservice.authenticate,userController.uploadFile);


//////finance service//////
router.post("/finance/create",authservice.authenticate,financeController.createVirtualAccount);
router.get("/finance/create",authservice.authenticate,financeController.getVirtualAccount);
router.post("/finance/checkout",authservice.authenticate,financeController.createCheckout);
router.patch("/finance/checkout",authservice.authenticate,financeController.confirmCheckout);
router.get("/finance/bulkCheck",authservice.authenticate,financeController.MultiResolve);

router.post("/transaction/create",authservice.authenticate,transactionController.create);
router.get("/transaction/get",authservice.authenticate,transactionController.getAllTransactions);


//special check service
router.post("/special/checkface",authservice.authenticate,specialController.doFaceCheck)




//////use auth middleware here /////////
router.get("/me",authservice.authorize,userController.getUser);
router.patch("/me",authservice.authorize,userController.updateUser);



///////create api user
router.post("/users/create",userController.makeUser);
export{router};

