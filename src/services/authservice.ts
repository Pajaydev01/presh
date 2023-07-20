import { Request,Response, NextFunction } from "express";
import { config } from "../config/config.js";
import * as jsontoken from 'jsonwebtoken';
import responseService from "./response.service.js";
import helper from "../database/helper.js";

class authservice{
public authorize=(req:Request,res:Response,next:NextFunction)=>{
try {
    const token:any=req.headers['x-auth-token'];
    if(!token)return responseService.respond(res,{},401,false,'unauthenticated');
    jsontoken.verify(token,config.SECRET,(err,value)=>{
        if(err)return responseService.respond(res,{},412,false,'Invalid token');
        next();
    });
} catch (error) {
    responseService.respond(res,error.data?error.data:error,error.code && typeof error.code=='number'?error.code:500,false,error.message?error.message:'Server error');
}
}

public authenticate=async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const token:any=req.headers['x-api-key'];
    if(!token)return responseService.respond(res,{},401,false,'unauthenticated');
    //check the user api in the db
    const check= await helper.select('apiUsers',['token'],[{token:token}]);
    if(check.length==0){
        return responseService.respond(res,{},401,false,'Invalid token'); 
    }
    next();
    } catch (error) {
        responseService.respond(res,error.data?error.data:error,error.code && typeof error.code=='number'?error.code:500,false,error.message?error.message:'Server error');  
    }
}

//authorization for api key

public getUser=(req:Request, res:Response)=>{
    try {
        let val;
        const token:any=req.headers['x-auth-token'];
        jsontoken.verify(token,config.SECRET,(err,value)=>{
            val=value;
        });
        return val
    } catch (error) {
        responseService.respond(res,error.data?error.data:error,error.code && typeof error.code=='number'?error.code:500,false,error.message?error.message:'Server error'); 
    }
}
}

export default new authservice();