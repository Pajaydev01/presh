import { Request,Response, NextFunction } from "express";
import responseService from "../services/response.service.js";
import helper from "../database/helper.js";
import actionService from "../services/actionService.js";
import { config } from "../config/config.js";
import NotificationRequest from "../requests/notificationRequests.js";

class notifcation extends NotificationRequest{
    public sendMail=async (req:Request,res:Response,next:NextFunction)=>{
    try {
        await this.emailCheck(req,res);
        //send the mail here
        const body=req.body;
        //console.log(body.multiple)
        if(body['multiple']){
            if(typeof(body.to)=='string'){
                responseService.respond(res,{},412,false,'For multiple send out, please pass emails as list of arrays');
                return;
            }
            const send=await actionService.sendMail(body.to,body.message,body.subject);
            responseService.respond(res,{},200,true,'Email request completed successfully');
            return;
        }
        if(typeof(body.to)!='string'){
            responseService.respond(res,{},412,false,'For single sendout, email has to be in string');
            return;
        }
        const send=await actionService.sendMail(body.to,body.message,body.subject);
        //return response
        responseService.respond(res,{},200,true,'Email request completed successfully');
    } catch (error) {
         responseService.respond(res,error.data?error.data:error,error.code && typeof error.code=='number'?error.code:500,false,error.message?error.message:'Server error');
    }
    }

    public sendSms=async (req:Request,res:Response,next:NextFunction)=>{
        try {
            await this.smsCheck(req,res);

            const request=req.body;
            let phone;
            let no = request.phone.toString();
            switch (no.charAt(0)) {
              case "0":
                phone = '234' + no.substr(1);
                break;
    
              case "+":
                phone = no.substr(1);
                break;
    
              default:
                phone = '234' + no;
            };
    
            //make the headers
            const headers={
                'Content-Type': 'application/json',
                  'Authorization':config.SMS_KEY,
                  Accept: 'application/json',
            }
    
            const body = {
                "from": request.from,
                "to": phone,
                "text": request.text
              };
              //console.log(body)
            const send=await actionService.makeRequest(config.SMS_URL,'POST',body,headers);
           // console.log(send)
            responseService.respond(res,{},200,true,'Sms sent successfully');
        } catch (error) {
            responseService.respond(res,error.data?error.data:error,error.code && typeof error.code=='number'?error.code:500,false,error.message?error.message:'Server error'); 
        }

    }


}

export default new notifcation();