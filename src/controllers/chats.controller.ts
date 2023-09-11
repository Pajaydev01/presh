import helper from "../database/helper";
import chatsRequest from "../requests/chats.request";
import authservice from "../services/authservice";
import responseService from "../services/response.service";
import websocketService from "../services/websocket.service";
import { Request,Response, NextFunction } from "express";

class chats extends chatsRequest{
    public load=async (req:Request, res:Response)=>{
        try {
            await this.getChatsCheck(req,res);
            let body;
            if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
                if(req.query.constructor === Object && Object.keys(req.query).length === 0){
    body={}
                }
                else{
                    body=req.query
                }
              }
              else{
                body=req.body;
              }
            //get the user chats and send back
            let chats:Array<any>=await helper.select('chats',[],[{sender:body.sender,target:body.receiver}]);
            //break out the chats
           // let chate;
            if(chats.length>0){
                const message=JSON.parse(chats[0].messages);
                delete chats[0].messages;
                chats[0]['messages']=message;
            }
            else{
                //console.log('here')
                chats=await helper.select('chats',[],[{sender:body.receiver,target:body.sender}]);
                //console.log('length',chats)
                if(chats.length>0){
                    const message=JSON.parse(chats[0].messages);
                    delete chats[0].messages;
                    chats[0]['messages']=message; 
                }
            }
            //return the answer
            responseService.respond(res,{...chats[0]},200,true,'chats retrieved')
        } catch (error) {
            responseService.respond(res,error.data?error.data:error,error.code && typeof error.code=='number'?error.code:500,false,error.message?error.message:'Server error');
        }
    }
}

export default new chats();