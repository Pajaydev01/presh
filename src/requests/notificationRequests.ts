import mainHelper from "./main";
import responseService from "../services/response.service.js";
import { Request,Response } from "express";
interface request{

}
class NotificationRequest extends mainHelper{

    public emailCheck=(req:Request,res:Response):Promise<void>=>{
        return new Promise((resolve,reject)=>{
            const required=[
                'to',
                'subject',
                'message'
            ];
            const check:any=this.run(req,required);
            let res;
            //console.log(check)
            if(!check){

                res={
                    code:400,
                    data:required,
                    message:"All fields are required"
                }
                reject(res)
                //responseService.respond(res,required,400,false,"All fields are required");
            }
            else{
                
                res=true
                resolve(res)
            }
            
            
        })
    }

    public smsCheck=(req:Request,res:Response):Promise<void>=>{
        return new Promise((resolve,reject)=>{
            const required=[
                'phone',
                'text',
                'from'
            ];
            const check:any=this.run(req,required);
            let res;
            //console.log(check)
            if(!check){
                res={
                    code:400,
                    data:required,
                    message:"All fields are required"
                }
                reject(res)
                //responseService.respond(res,required,400,false,"All fields are required");
            }
            else{
                res=true
                resolve(res)
            }
            
            
        })
    }
}

export default NotificationRequest;