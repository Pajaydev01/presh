import { Request,Response, NextFunction } from "express";
import responseService from "../services/response.service.js";
import helper from "../database/helper.js";
import actionService from "../services/actionService.js";
import { config } from "../config/config.js";
import authservice from "../services/authservice.js";
import transactionReq from "../requests/transactionRequest";
class transaction extends transactionReq{
    public create=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            await this.transactionCheck(req,res);
            const body=req.body;
            const user=await authservice.getUser(req,res);
            //const user=authservice.getUser(req,res);
            if(body.type!='credit' && body.type!='debit') return responseService.respond(res,{},412,false,'Invalid type');
            // save the transaction, if it is debit, reduce balance in savings, if it is credit, add to balance
            //balance is sufficient
            const balance:Array<any>=await helper.select('details',[body.field],[{mail:user.mail}],"AND");
            if(parseInt(balance[0][body.field])<parseInt(body.amount) && body.type=='debit')return responseService.respond(res,{},412,false,'Insufficient balance');
            //save transaction and update balance
            body['mail']=user.mail;
            const ball:any=balance[0][body.field]=='' || balance[0][body.field]==null?0:parseInt(balance[0][body.field]);
            const bal=body.type=='debit'?Math.ceil(ball-parseInt(body.total)):Math.ceil(ball+parseInt(body.total));
            const update={}
            update[body.field]=bal;
            await helper.update('details',update,{mail:user.mail});
            const info=body;
            delete info['field'];
            await helper.insert('transaction',info);
            //instert to profit
            //done!
            responseService.respond(res,{},201,true,'Transaction created');

        } catch (error) {
            responseService.respond(res,error.data?error.data:error,error.code && typeof error.code=='number'?error.code:500,false,error.message?error.message:'Server error');
        }
    }

    public getAllTransactions=async (req:Request,res:Response,next:NextFunction)=>{
        try {
            await this.getTransactionCheck(req,res);
            let body;
            if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
                if(req.query.constructor === Object && Object.keys(req.query).length === 0){
    body={}
                }
                else{
                    body=req.query
                }
              }
              else{
                body=req.body;
              }
            const user=authservice.getUser(req,res);

            //get the user transaction
            const where=body.id?[{sn:body.id, mail:user.mail}]:[{mail:user.mail}];
            const transactions=await helper.select('transactions',[],where,'AND','id','DESC');
            const message=transactions.length==0?'No transaction found':'Transaction request successful';
            responseService.respond(res,transactions,201,true,message);
        } catch (error) {
            responseService.respond(res,error.data?error.data:error,error.code && typeof error.code=='number'?error.code:500,false,error.message?error.message:'Server error');
        }
    }

    public getDetails=async (req:Request,res:Response,next:NextFunction)=>{
        try {
            const user=authservice.getUser(req,res);
            const info=await helper.select('details',[],[{mail:user.mail}]);
            responseService.respond(res,info,200,true,'User wallet retrieved')
        } catch (error) {
            responseService.respond(res,error.data?error.data:error,error.code && typeof error.code=='number'?error.code:500,false,error.message?error.message:'Server error');
        }
    }
}

export default new transaction()