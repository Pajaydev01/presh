"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = __importStar(require("crypto"));
const mailer = __importStar(require("nodemailer"));
const config_js_1 = require("../config/config.js");
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs = __importStar(require("fs"));
const mime = __importStar(require("mime-db"));
const canvas = __importStar(require("canvas"));
const faceapi = __importStar(require("face-api.js"));
const node_cluster_1 = __importDefault(require("node:cluster"));
//import '@tensorflow/tfjs-node';
class action {
    constructor() {
        this.loop = async (file, user, path, url) => {
            return new Promise((resolve, reject) => {
                const data = [];
                file.forEach(async (res, index) => {
                    const process = await this.uploadImage(path, user, res);
                    const image = url + '/' + path + process;
                    data.push(image);
                });
                resolve(data);
            });
        };
        //detect face
        this.detectFace = async (file) => {
            return new Promise(async (resolve, reject) => {
                try {
                    //turn the base 64 into a fil
                    const { Canvas, Image, ImageData } = canvas;
                    faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
                    const img = new canvas.Image();
                    img.src = file;
                    await faceapi.nets.faceLandmark68Net.loadFromDisk('./public/models');
                    await faceapi.nets.ssdMobilenetv1.loadFromDisk('./public/models');
                    const detect = await faceapi.detectSingleFace(img);
                    //console.log(detect)
                    resolve(detect);
                }
                catch (err) {
                    console.log(err);
                    reject(err);
                }
            });
        };
        this.genToken = () => {
            return [...Array(30)]
                .map((e) => ((Math.random() * 36) | 0).toString(36))
                .join('');
        };
        this.restartService = () => {
            node_cluster_1.default.emit('exit', {});
        };
    }
    async hasher(password) {
        return new Promise(async (resolve, reject) => {
            const salt = crypto.randomBytes(16).toString('hex');
            const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
            resolve({ hash: hash, salt: salt });
        });
    }
    async compare(hash, password, salt) {
        const hashed = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
        return hash === hashed;
    }
    async sendMail(to, email, subject) {
        const setup = mailer.createTransport({
            host: config_js_1.config.EMAIL_HOST,
            port: 465,
            //secure: true,
            auth: {
                // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                user: config_js_1.config.EMAIL_USER,
                pass: config_js_1.config.EMAIL_PASS
            }
        });
        const send = await setup.sendMail({
            from: config_js_1.config.EMAIL_USER,
            to: to,
            html: email,
            subject: subject
        });
        return send;
    }
    async makeRequest(url, method, data = {}, header) {
        return new Promise(async (resolve, reject) => {
            const param = {
                method: method,
                headers: header
            };
            method != 'GET' ? param['body'] = JSON.stringify(data) : '';
            (0, node_fetch_1.default)(url, param).then(resp => {
                return resp.json();
            }).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            });
            // axios({
            //     method:method,
            //     url:url,
            //     headers:header,
            //     timeout:7000,
            //     data:data
            // }).then(res=>{
            //     resolve(res)
            // }).catch(err=>{
            //     console.log(err)
            //     reject (err)
            // }) 
        });
    }
    async uploadImage(path, user, file, reduce = false) {
        const decodeBase64Image = (dataString) => {
            // console.log('file: ', dataString)
            return new Promise((resolve, reject) => {
                // var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
                //var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,/),
                const matches = dataString.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/), response = {};
                // console.log('match: ',dataString.replace(/^data:([A-Za-z-+/]+);base64,/, ''))
                if (!matches.length) {
                    reject(new Error('Invalid input string'));
                }
                response.type = matches[1];
                response.data = new Buffer(dataString.replace(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/, ''), 'base64');
                //console.log(response)
                resolve(response);
            });
        };
        return new Promise(async (resolve, reject) => {
            try {
                var decodedImg = await decodeBase64Image(file);
                // console.log(decodedImg)
                var imageBuffer = decodedImg.data;
                var type = decodedImg.type;
                var extension = mime[type];
                //console.log(extension)
                const date = new Date().getTime() + this.genToken();
                var fileName = date + user + "upload." + extension.extensions[0];
                const write = fs.writeFileSync(path + fileName, imageBuffer, 'utf8');
                resolve(fileName);
            }
            catch (err) {
                //console.log(err)
                reject(err);
            }
        });
    }
    async deleteFile(path, name) {
        return new Promise((resolve, reject) => {
            fs.unlinkSync(path + name);
            resolve('done');
        });
    }
    //optimized for case of missing images in server
    async deleteMultipleFile(file) {
        return new Promise(async (resolve, reject) => {
            const deleted = [];
            try {
                file.forEach((res, index) => {
                    //for errors and missing files, write a sequence to ignore
                    //get the path and name
                    // const pather=path.resolve(__dirname,`../${res.split('src/')[1]}`);
                    const pather = `src/${res.split('src/')[1]}`;
                    // console.log('here the path: ',pather)
                    fs.unlinkSync(pather);
                    deleted.push(res);
                });
                resolve('done');
            }
            catch (error) {
                //remove the errored file and repush
                let deler;
                const rem = file.filter(res => `src/${res.split('src/')[1]}` != error.path);
                //if there are some deleted, remove them from the sent file and continue deleting
                if (deleted.length > 0) {
                    deler = rem.filter(res => {
                        return !deleted.includes(res);
                    });
                }
                else {
                    deler = rem;
                }
                if (deler.length == 0) {
                    // console.log(deler)
                    //resolve('done')
                }
                else {
                    //console.log('errored',deleted);
                    await this.deleteMultipleFile(rem);
                }
                resolve(error);
            }
        });
    }
}
exports.default = new action();
//# sourceMappingURL=actionService.js.map