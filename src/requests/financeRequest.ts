import mainHelper from "./main";
import responseService from "../services/response.service.js";
import { Request,Response } from "express";
interface request{

}
class fincanceRequest extends mainHelper{

    public createVACheck=(req:Request,res:Response):Promise<void>=>{
        return new Promise((resolve,reject)=>{
            const required=[
                'firstname',
                'lastname',
                'bvn',
                'dob',
                'user_id'
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

    public checkoutCheck=(req:Request,res:Response):Promise<void>=>{
        return new Promise((resolve,reject)=>{
            const required=[
                'customername',
                'amount',
                'email',
                'user_id'
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

    public accountCheck=(req:Request,res:Response):Promise<void>=>{
        return new Promise((resolve,reject)=>{
            const required=[
                'user_id'
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
    public confirmCheck=(req:Request,res:Response):Promise<void>=>{
        return new Promise((resolve,reject)=>{
            const required=[
                'reference',
                'user_id'
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

export default fincanceRequest;