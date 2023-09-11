"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_service_js_1 = __importDefault(require("../services/response.service.js"));
const helper_js_1 = __importDefault(require("../database/helper.js"));
const actionService_js_1 = __importDefault(require("../services/actionService.js"));
const userRequests_js_1 = __importDefault(require("../requests/userRequests.js"));
const authservice_js_1 = __importDefault(require("../services/authservice.js"));
const websocket_service_js_1 = __importDefault(require("../services/websocket.service.js"));
class users extends userRequests_js_1.default {
    constructor() {
        super(...arguments);
        this.getUser = async (req, res, next) => {
            try {
                const user = authservice_js_1.default.getUser(req, res);
                const resp = await helper_js_1.default.select('users', [], [{ id: user.id }], 'AND');
                if (resp.length == 0)
                    return response_service_js_1.default.respond(res, {}, 412, false, 'User not found');
                delete resp[0].password;
                delete resp[0].salt;
                // console.log(user)
                websocket_service_js_1.default.send({ ...resp[0] });
                response_service_js_1.default.respond(res, { ...resp[0] }, 200, true, 'User details retrieved successfully');
            }
            catch (error) {
                response_service_js_1.default.respond(res, error.data ? error.data : error, error.code && typeof error.code == 'number' ? error.code : 500, false, error.message ? error.message : 'Server error');
            }
        };
        this.updateUser = async (req, res, next) => {
            try {
                const body = req.body;
                const count = [];
                for (const key in body) {
                    if (Object.prototype.hasOwnProperty.call(body, key)) {
                        const element = body[key];
                        count.push(key);
                    }
                }
                if (count.length == 0)
                    return response_service_js_1.default.respond(res, {}, 400, false, 'Please parse in items to update, ensure it matches the saved user value');
                //disallow password or salt from being passed
                if (count.includes('password') || count.includes('salt'))
                    return response_service_js_1.default.respond(res, {}, 403, false, '');
                const user = authservice_js_1.default.getUser(req, res);
                //update record
                await helper_js_1.default.update('users', body, { id: user.id });
                response_service_js_1.default.respond(res, {}, 201, true, 'Updated');
            }
            catch (error) {
                response_service_js_1.default.respond(res, error.data ? error.data : error, error.code && typeof error.code == 'number' ? error.code : 500, false, error.message ? error.message : 'Server error');
            }
        };
        this.uploadFile = async (req, res, next) => {
            try {
                const check = await this.uploadCheck(req, res);
                //accept files 
                const body = req.body;
                const path = 'src/uploads/';
                const port = req.hostname;
                //const url=`${req.protocol}://${req.hostname}:${config.PORT}`;
                const url = `http://192.168.137.1:1000`;
                // console.log(body)
                //work on multiple uploads here
                if (body.multiple) {
                    //collect the array, and save, no need to delete
                    if (typeof (body.file) == 'string') {
                        response_service_js_1.default.respond(res, {}, 412, false, 'For multiple uploads, the base64 string must be in an array');
                        return;
                    }
                    const loop = await actionService_js_1.default.loop(body.file, body.user, path, url);
                    response_service_js_1.default.respond(res, { url: loop }, 201, true, 'File uploaded');
                    return;
                }
                if (typeof (body.file) != 'string') {
                    response_service_js_1.default.respond(res, {}, 412, false, 'For single uploads, the base64 string must be in string');
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
                const process = await actionService_js_1.default.uploadImage(path, body.user, body.file);
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
                response_service_js_1.default.respond(res, { url: url + '/' + path + process }, 201, true, 'File uploaded');
            }
            catch (error) {
                response_service_js_1.default.respond(res, error.data ? error.data : error, error.code && typeof error.code == 'number' ? error.code : 500, false, error.message ? error.message : 'Server error');
            }
        };
        this.makeUser = async (req, res) => {
            try {
                await this.authCheck(req, res);
                //check if the user exist
                const body = req.body;
                const check = await helper_js_1.default.select('apiUsers', ['username'], [{ username: body.username }]);
                if (check.length != 0) {
                    //user exists already
                    response_service_js_1.default.respond(res, {}, 412, false, 'User already exists');
                    return;
                }
                //create the user
                const token = actionService_js_1.default.genToken();
                const response = {
                    token: token,
                    username: body.username
                };
                //save to db
                await helper_js_1.default.insert('apiUsers', response);
                response_service_js_1.default.respond(res, response, 201, true, 'User created');
            }
            catch (error) {
                response_service_js_1.default.respond(res, error.data ? error.data : error, error.code && typeof error.code == 'number' ? error.code : 500, false, error.message ? error.message : 'Server error');
            }
        };
        this.delFiles = async (req, res) => {
            try {
                await this.delCheck(req, res);
                const body = req.body;
                //collect the path 
                if (typeof body.file == 'string')
                    return response_service_js_1.default.respond(res, {}, 412, false, 'files must be parsed as an array');
                await actionService_js_1.default.deleteMultipleFile(body.file);
                response_service_js_1.default.respond(res, {}, 200, true, 'files removed');
            }
            catch (error) {
                console.log(error);
                response_service_js_1.default.respond(res, error.data ? error.data : error, error.code && typeof error.code == 'number' ? error.code : 500, false, error.message ? error.message : 'Server error');
            }
        };
    }
}
exports.default = new users();
//# sourceMappingURL=user.controller.js.map