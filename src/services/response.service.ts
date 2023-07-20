import { Request,Response, NextFunction } from "express";
import { json } from "stream/consumers";
interface data{
}

class handle extends Error{
    respond=(response:any,data:data,code:number, success:boolean, message:string,token:string=null)=>{
        const resp= token?{
            success:success,
            message,
            data,
            token
        }:{
            success:success,
            message,
            data 
        }
        return response.status(code).json(resp);
    };

}

export default new handle();