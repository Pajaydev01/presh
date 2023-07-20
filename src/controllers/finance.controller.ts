//finance starts here
import financeservice from "../services/financeservice";
import fincanceRequest from "../requests/financeRequest";
import { Request,Response, NextFunction } from "express";
import responseService from "../services/response.service.js";
import helper from "../database/helper";
import actionService from "../services/actionService";

class fincanceController extends fincanceRequest{
    public createVirtualAccount=async (req:Request, res:Response, next:NextFunction)=>{
    try {
        await this.createVACheck(req,res);
        //start
        const body=req.body;
        const request=await financeservice.createVirtualAccount(body.firstname,body.lastname,body.bvn,body.dob);
       // console.log(request)
       if(!request.success){
        responseService.respond(res,{},412,false,request.error);
        return;
       }

       //check if the user already created and update
       const checker:Array<any>=await helper.select('wallet',['user_id'],[{user_id:body.user_id}]);
       //save into the db
       if(checker.length>0){
        //update
        const data=request.data.accountInformation;
       data['virtualId']=request.data._id;
        const update=await helper.update('wallet',data,{user_id:body.user_id});
        responseService.respond(res,request.data,200,true,'Request processed');
        return;
       }
       const data=request.data.accountInformation;
       data['user_id']=body.user_id;
       data['virtualId']=request.data._id;
       data['balance']=0;
       await helper.insert('wallet',data);
       responseService.respond(res,request.data,200,true,'Request processed');
    } catch (error) {
        responseService.respond(res,error.data?error.data:error,error.code && typeof error.code=='number'?error.code:500,false,error.message?error.message:'Server error');   
    }
    }

    public getVirtualAccount=async (req:Request, res:Response)=>{
        try {
            await this.accountCheck(req,res);
            //run
            const get:Array<any>=await helper.select('wallet',[],[{user_id:req.body.user_id}]);
            responseService.respond(res,{...get[0]},200,true,'Account retrieved successfuly')
        } catch (error) {
            responseService.respond(res,error.data?error.data:error,error.code && typeof error.code=='number'?error.code:500,false,error.message?error.message:'Server error');  
        }
    }

    public createCheckout=async (req:Request, res:Response, next:NextFunction)=>{
        try {
            await this.checkoutCheck(req,res);
            //start
            const request=req.body;
            const create=await financeservice.createCheckout(request.amount,request.customername,request.email);
            if(!create.status){
            responseService.respond(res,create,412,false,'An error occured');
            return;
            }
            //save into checkouts as pending transaction
            //check if it exists before
            const check=await helper.select('checkouts',['reference'],[{reference:create.data.payCode,user_id:request.user_id}],'AND');
            if(check.length>0){
                responseService.respond(res,{},412,false,'Duplicate transaction');
                return;  
            }
            //save now
            await helper.insert('checkouts',{user_id:request.user_id,amount:request.amount,status:false,reference:create.data.payCode});
            responseService.respond(res,create.data,200,true,'Request successsful');
        } catch (error) {
            responseService.respond(res,error.data?error.data:error,error.code && typeof error.code=='number'?error.code:500,false,error.message?error.message:'Server error'); 
        }
    }

    public confirmCheckout=async (req:Request,res:Response)=>{
        try {
            await this.confirmCheck(req,res);
            // start for single
            const request=req.body;
            //process single here
            const check:Array<any>=await helper.select('checkouts',[],[{reference:request.reference,user_id:request.user_id}],'AND');
            if(check.length==0){
                responseService.respond(res,{},412,false,'Transaction not found');
                return;
            }
        //check the transaction
        const run=await financeservice.confirmCheckout(request.reference);
        if(run.data.status=='success'){
            //check if the status is not already marked as success
            if(check[0].status!=0){
                responseService.respond(res,{payCode:run.data.reference, amount:run.data.amount, customer:run.data.customer},200,true,'Transaction already completed');  
                return;
            }
            //first save into transaction
            await helper.insert('transactions',{user_id:request.user_id,amount:run.data.amount,type:'credit',description:'Wallet top up via checkout',t_id:request.reference});
            //add to the user balance
            const get:Array<any>=await helper.select('wallet',['balance'],[{user_id:request.user_id}]);
            const balance=get[0].balance;
            await helper.update('wallet',{balance:(parseInt(balance)+parseInt(run.data.amount))},{user_id:request.user_id});
            //mark the status as completed
            await helper.update('checkouts',{status:true},{reference:request.reference});
            //send success
            responseService.respond(res,{payCode:run.data.reference, amount:run.data.amount, customer:run.data.customer},200,true,'Transaction completed');
            return;
        }
        responseService.respond(res,{payCode:run.data.reference, amount:run.data.amount, customer:run.data.customer},201,false,'Transaction pending');
        } catch (error) {
            responseService.respond(res,error.data?error.data:error,error.code && typeof error.code=='number'?error.code:500,false,error.message?error.message:'Server error');   
        }
    }

    public MultiResolve=async (req:Request, res:Response)=>{
        const looper=async (items:Array<any>):Promise<any>=>{
            return new Promise(async (resolve, reject)=>{
                const completed=[];
                const pending=[];
                const run=await financeservice.confirmCheckout(items,true);
                //console.log(run.length)
                run.forEach(async (res,index:number)=>{
                    if(res.data.status=='success'){
                        completed.push('done');
                        //first save into transaction
                        //get that checkout
                        const gett:Array<any>=await helper.select('checkouts',['user_id'],[{reference:res.data.reference}]);
                        await helper.insert('transactions',{user_id:gett[0].user_id,amount:res.data.amount,type:'credit',description:'Wallet top up via checkout',t_id:res.data.reference});
                        //add to the user balance
                        const get:Array<any>=await helper.select('wallet',['balance'],[{user_id:gett[0].user_id}]);
                        const balance=get[0].balance;
                        await helper.update('wallet',{balance:(parseInt(balance)+parseInt(res.data.amount))},{user_id:gett[0].user_id});
                        //mark the status as completed
                        await helper.update('checkouts',{status:true},{reference:res.data.reference});
                        //pass in to the completed array
                        //console.log(res.reference)
                    }
                    else{
               // console.log(pending)
                    //push into the incomplete
                    pending.push('done');
                    }
                   });  
                  
                   resolve({completed:completed,pending:pending});
            })
        }
        try {
           //first get all the pending requests and run them 
           const get:Array<any>= await helper.select('checkouts',['reference','user_id'],[{status:0}]);
           if(get.length==0){
            responseService.respond(res,{},200,false,'No pending transactions found');
            return;
           }
           //console.log(get)
           const getter=await looper(get);
           responseService.respond(res,{completed:getter.completed.length,pending:getter.pending.length},200,true,'Operation complete');
        } catch (error) {
        responseService.respond(res,error.data?error.data:error,error.code && typeof error.code=='number'?error.code:500,false,error.message?error.message:'Server error');   
        }
    }
    
    
}

export default new fincanceController();