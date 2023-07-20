import { Response } from "express";
class error extends Error{
    status:any;

    public httpCode: number;
    constructor (message, statusCode){
        super(message);
      
        Error.captureStackTrace(this,this.constructor);
        this.status=200
      //  Error.captureStackTrace(this,this.constructor);
       // Error.prepareStackTrace(this.message,)
    }
}


const throwError=(message,code)=>{
    throw new error(message,code)
}

export default throwError;