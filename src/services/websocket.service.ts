import { Socket, Server } from "socket.io";
import actionService from "./actionService";
import helper from "../database/helper";
import http from 'node:http';
class socketIo{
    public con:Array<{user:string,con:Socket}>=[];
    public src:Server;

    public connect=async (server:any):Promise<void>=>{
        const connect=new Server(server,{
            cors:{
                origin:"*",
                methods:['GET','POST'],
                credentials:true
            },
            transports:['websocket'],
            allowEIO3:true,
            pingTimeout:19000000,
            allowUpgrades:false
        });

        this.src=connect;

        connect.on('connection',(res:Socket)=>{
            let list=this.con;
            const things={
                user:res.handshake.auth.userId,
                con:res
            };
            if(this.con.length>0){
                list=this.con.filter(resp=>resp.user!=res.handshake.auth.userId);
            }
            this.con=list;
            this.con.push(things);

            res.on('message',async (res)=>{
                switch(res.type){
                    case 'message':
                    const message=[];
                    res.messages.forEach(element => {
                        const res={
                            message:element.message,
                            sending:false,
                            time:element.time,
                            sender:element.sender,
                            target:element.target
                        }
                        message.push(res);
                    });
    
                    const sent=JSON.stringify(message);
                    delete res.messages;
                    delete res.type
                    res['messages']=sent;
                    
                    const check=await helper.select('chats',[],[{sender:res.sender, target:res.target}]);
                    //console.log('length', check.length)
                    if(check.length==0){
                        //reverse and check
                        const check=await helper.select('chats',[],[{sender:res.target, target:res.sender}]);
                        if(check.length==0){
                        const insert=await helper.insert('chats',res);
                        }
                        else{
                            const save=await helper.update('chats',res,{sender:res.sender,target:res.target}); 
                        }
                    }
                    else{
                        const save=await helper.update('chats',res,{sender:res.sender,target:res.target});
                    }
                    //emit back
                    const response={
                        users:[res.sender,res.target],
                        message:JSON.parse(res.messages),
                        type:'message'
                    }
                    connect.emit('newMessage',JSON.stringify(response))
                    break;

                    case 'typing':
                        const respy={
                            users:[res.sender,res.target],
                            ...res
                        }
                    connect.emit('newMessage',JSON.stringify(respy))
                    break;

                    case 'blur':
                        const reser={
                            users:[res.sender,res.target],
                            ...res
                        }
                    connect.emit('newMessage',JSON.stringify(reser))
                    break;
                }
               
            })
        });

        connect.on('disconnect',(res:Socket)=>{
            console.log('Disconnected')
        })

        
    }


    public send=(message:any)=>{
      //  message="hollo everyone";
        if(this.con.length>0){
            console.log('total users: ',this.con.length);
            this.src.emit('newMessage',JSON.stringify(message));
        }
    }
}

export default new socketIo();