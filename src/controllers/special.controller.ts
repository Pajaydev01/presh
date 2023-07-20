import actionService from "../services/actionService";
import speciaRequest from "../requests/specialRequest";
import { Request,Response, NextFunction } from "express";
import responseService from "../services/response.service";
class specialContoller extends speciaRequest{
public doFaceCheck=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        await this.veryfyCheck(req,res);
        const run=await actionService.detectFace(req.body.file);
       // console.log(run)
       const remark={};
       remark['score']=run?._score?run._score:0
       if(remark['score']!=0){
       remark['comment']=remark['score']<=0.95?'poor':(remark['score']>0.95 && remark['score']<=0.97)?'retake':'good';
       }
       else{
        remark['comment']='no face'
       }
        responseService.respond(res,remark,200,true,'Face check completed');
    } catch (error) {
        responseService.respond(res,error.data?error.data:error,error.code && typeof error.code=='number'?error.code:500,false,error.message?error.message:'Server error'); 
    }
}
}

export default new specialContoller();