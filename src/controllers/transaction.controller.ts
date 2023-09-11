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
            //const user=authservice.getUser(req,res);
            if(body.type!='credit' && body.type!='debit') return responseService.respond(res,{},412,false,'Invalid type');
            // save the transaction, if it is debit, reduce balance in savings, if it is credit, add to balance
            //balance is sufficient
            const balance:Array<any>=await helper.select('wallet',['balance'],[{user_id:body.user_id}],"AND");
           if(balance.length==0)return responseService.respond(res,{},412,false,'User has no wallet');
            if(parseInt(balance[0].balance)<parseInt(body.amount) && body.type=='debit')return responseService.respond(res,{},412,false,'Insufficient balance');
            //save transaction and update balance
            body['user_id']=body.user_id;
            await helper.insert('transactions',body);
            const ball:any=parseInt(balance[0].balance);
            const bal=body.type=='debit'?Math.ceil(ball-parseInt(body.amount)):Math.ceil(ball+parseInt(body.amount));
            await helper.update('wallet',{balance:bal},{user_id:body.user_id});
            //instert to profit
            const params={
                amount:body.charges,
                description:body.description,
                t_id:body.t_id
            }
            await helper.insert('profit',params);
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
            //const user=authservice.getUser(req,res);

            //get the user transaction
            const where=body.id?[{id:body.id, user_id:body.user_id}]:[{user_id:body.user_id}];
            const transactions=await helper.select('transactions',[],where,'AND','id','DESC');
            const message=transactions.length==0?'No transaction found':'Transaction request successful';
            responseService.respond(res,transactions,201,true,message);
        } catch (error) {
            responseService.respond(res,error.data?error.data:error,error.code && typeof error.code=='number'?error.code:500,false,error.message?error.message:'Server error');
        }
    }
}

export default new transaction()