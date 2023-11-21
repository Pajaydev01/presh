import { Request,Response, NextFunction } from "express";
import registerRequest from "../requests/registerRequest.js";
import responseService from "../services/response.service.js";
import helper from "../database/helper.js";
import * as jsontoken from 'jsonwebtoken';
import { config } from "../config/config.js";
import * as bycrypt from 'bcryptjs';
import actionService from "../services/actionService.js";
interface sample{
    body:''
};
class login extends registerRequest{
    public register=async (req:Request,res:Response,next:NextFunction)=>{
        try {
            const body=req.body;
            //run check for required
           await this.registerCheck(req,res);
            //check if email or phone exists
            const checker:any=await helper.select('users',[],[{mail:body.mail}],'AND');
            if(checker.length>0)return responseService.respond(res,{},412,false,'The selected email or phone number already exists');
            
            //hash password
            
            const hash=await actionService.hasher(body.password);
            body['password']=hash.hash;
            body['salt']=hash.salt;
            const saver=await helper.insert('users',body);
            //get the user and insert saving
            await helper.insert('details',{mail:body.mail});
            //create user token
            //return success
            const user:Array<any>=await helper.select('users',[],[{mail:body.mail}],'AND');
            delete user[0].password;
            delete user[0].salt;
            const token=jsontoken.sign({...user[0]},config.SECRET,{
                expiresIn: 86400 // expires in 24 hours
              });
            responseService.respond(res,{},200,true,'Registeration successful',token);
        } catch (error) {
            //console.log(error.code)
          responseService.respond(res,error.data?error.data:error,error.code && typeof error.code=='number'?error.code:500,false,error.message?error.message:'Server error');
        }
    }

    public login=async (req:Request,res:Response,next:NextFunction)=>{
        try {
            const body=req.body;
         await this.loginCheck(req,res);
            //checker
            
            const checker:Array<any>=await helper.select('users',[],[{mail:body.email}],'AND');
            if(checker.length==0)return responseService.respond(res,{},404,false,'Invalid email');

            //proceed
            const check=await actionService.compare(checker[0].password,body.password,checker[0].salt);
            if(!check)return responseService.respond(res,{},412,false,'Invalid email or password');

            //proceed to login and generate token
          
            //return success
            delete checker[0].password;
            delete checker[0].salt;
            const token=jsontoken.sign({...checker[0]},config.SECRET,{
                expiresIn: 86400 // expires in 24 hours
              });
            responseService.respond(res,{...checker[0]},200,true,'login successful',token);

        } catch (error) {
            console.log(error)
            responseService.respond(res,error.data?error.data:error,error.code && typeof error.code=='number'?error.code:500,false,error.message?error.message:'Server error'); 
        }
    }
}




export default new login();