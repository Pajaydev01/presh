import mainHelper from "./main";
import responseService from "../services/response.service.js";
import { Request,Response } from "express";
interface request{

}
class speciaRequest extends mainHelper{
    public veryfyCheck=(req:Request,res:Response):Promise<void>=>{
        return new Promise((resolve,reject)=>{
            const required=[
                'file',
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


        //create the requirement and call the super
}

export default speciaRequest;