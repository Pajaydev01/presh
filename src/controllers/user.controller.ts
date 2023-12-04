import { Request, Response, NextFunction } from "express";
import responseService from "../services/response.service.js";
import helper from "../database/helper.js";
import actionService from "../services/actionService.js";
import * as jsontoken from 'jsonwebtoken';
import { config } from "../config/config.js";
import userRequests from "../requests/userRequests.js";
import authservice from "../services/authservice.js";
import websocketService from "../services/websocket.service.js";
class users extends userRequests {
    public getUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = authservice.getUser(req, res);
            const resp: Array<any> = await helper.select('users', [], [{ id: user.id }], 'AND');
            if (resp.length == 0) return responseService.respond(res, {}, 412, false, 'User not found');
            delete resp[0].password;
            delete resp[0].salt;
            // console.log(user)
            websocketService.send({ ...resp[0] });
            responseService.respond(res, { ...resp[0] }, 200, true, 'User details retrieved successfully');
        } catch (error) {
            responseService.respond(res, error.data ? error.data : error, error.code && typeof error.code == 'number' ? error.code : 500, false, error.message ? error.message : 'Server error');
        }
    }

    public updateUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = req.body;
            const count = [];
            for (const key in body) {
                if (Object.prototype.hasOwnProperty.call(body, key)) {
                    const element = body[key];
                    count.push(key)
                }
            }
            if (count.length == 0) return responseService.respond(res, {}, 400, false, 'Please parse in items to update, ensure it matches the saved user value');
            //disallow password or salt from being passed
            if (count.includes('password') || count.includes('salt')) return responseService.respond(res, {}, 403, false, '');
            const user = authservice.getUser(req, res);
            //update record
            await helper.update('users', body, { id: user.id })
            responseService.respond(res, {}, 201, true, 'Updated');
        } catch (error) {
            responseService.respond(res, error.data ? error.data : error, error.code && typeof error.code == 'number' ? error.code : 500, false, error.message ? error.message : 'Server error');
        }
    }

    public uploadFile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const check = await this.uploadCheck(req, res);
            //accept files 
            const body = req.body;
            const path = 'src/uploads/';
            const port = req.hostname;
            const url = `${req.protocol}://${req.hostname}:${config.PORT}`;
            // const url=`http://192.168.137.1:1000`;
            // console.log(body)
            //work on multiple uploads here
            if (body.multiple) {
                //collect the array, and save, no need to delete
                if (typeof (body.file) == 'string') {
                    responseService.respond(res, {}, 412, false, 'For multiple uploads, the base64 string must be in an array');
                    return;
                }
                const loop = await actionService.loop(body.file, body.user, path, url);
                responseService.respond(res, { url: loop }, 201, true, 'File uploaded');
                return;
            }

            if (typeof (body.file) != 'string') {
                responseService.respond(res, {}, 412, false, 'For single uploads, the base64 string must be in string');
                return;
            }
            //check if the user already has a file and call the delete
            //    const checker: Array<any>=await helper.select('uploads',[],[{user_id:body.user}],'AND');
            //    //if record exists, delete before uploading
            //    if(checker.length>0){
            //     const path=checker[0].path;
            //     const name=checker[0].name;
            //     //delete
            //     const deleter=await actionService.deleteFile(path,name);
            //    }
            const process = await actionService.uploadImage(path, body.user, body.file);
            //save to db
            //    if(checker.length==0){
            //     //create
            //     const insert=await helper.insert('uploads',{user_id:body.user,path:path,name:process});
            //     //end process
            //     responseService.respond(res,{url:url+'/'+path+process},201,true,'File uploaded');
            //     return;
            //    }
            // const update= await helper.update('uploads',{path:path,name:process},{user_id:body.user});

            //get the protocol, host and port
            // const item=body.file.replace(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/, '');
            responseService.respond(res, { url: url + '/' + path + process }, 201, true, 'File uploaded');
        } catch (error) {
            responseService.respond(res, error.data ? error.data : error, error.code && typeof error.code == 'number' ? error.code : 500, false, error.message ? error.message : 'Server error');
        }
    }

    public delFiles = async (req: Request, res: Response) => {
        try {
            await this.delCheck(req, res);
            const body = req.body;
            //collect the path 
            if (typeof body.file == 'string') return responseService.respond(res, {}, 412, false, 'files must be parsed as an array');
            await actionService.deleteMultipleFile(body.file);
            responseService.respond(res, {}, 200, true, 'files removed');
        } catch (error) {
            console.log(error)
            responseService.respond(res, error.data ? error.data : error, error.code && typeof error.code == 'number' ? error.code : 500, false, error.message ? error.message : 'Server error');
        }
    }

    public checkWallet = async (req: Request, res: Response) => {
        try {
            const user = authservice.getUser(req, res);
            const checker: Array<any> = await helper.select('bank', [], [{ mail: user.mail }]);
            if (checker.length == 0) return responseService.respond(res, { hasAccount: false }, 200, true, 'User has no bank saved');
            return responseService.respond(res, { hasAccount: true }, 200, true, 'User has account');
        } catch (error) {
            responseService.respond(res, error.data ? error.data : error, error.code && typeof error.code == 'number' ? error.code : 500, false, error.message ? error.message : 'Server error');
        }
    }

    public saveBank = async (req: Request, res: Response) => {
        try {
            await this.bankCheck(req, res);
            const user = await authservice.getUser(req, res);
            const body = req.body;
            body['swift'] = body.swift || 'nill',
                body['btc'] = body.btc || 'nil';
            body['mail'] = user.mail;

            await helper.insert('bank', body);
            return responseService.respond(res, {}, 200, true, 'Bank information saved')
        } catch (error) {
            responseService.respond(res, error.data ? error.data : error, error.code && typeof error.code == 'number' ? error.code : 500, false, error.message ? error.message : 'Server error');
        }
    }
}

export default new users();