import * as bycrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as mailer from 'nodemailer';
import { config } from "../config/config.js";
import fetch from 'node-fetch';
import * as fs from 'fs';
import * as mime from 'mime-db';
import * as canvas from 'canvas';
import * as faceapi from 'face-api.js';
import cluster from 'node:cluster';
import * as  os from 'os';
import http from 'node:http'; 
import path from 'node:path';
//import '@tensorflow/tfjs-node';
class action{
    async hasher(password:string): Promise<any>{
        return new Promise(async(resolve,reject)=>{
            const salt = crypto.randomBytes(16).toString('hex'); 
           const hash=crypto.pbkdf2Sync(password,salt,  
            1000, 64, `sha512`).toString(`hex`); 
            resolve({hash:hash,salt:salt});
        })
    }

    public async compare(hash:string, password:string, salt:BinaryType){
        const hashed = crypto.pbkdf2Sync(password,  
            salt, 1000, 64, `sha512`).toString(`hex`); 
            return hash === hashed; 
    }

    public async sendMail(to:string,email:string, subject:string):Promise<{}>{
        const setup=mailer.createTransport({
            host: config.EMAIL_HOST,
            port: 465,
            //secure: true,
            auth: {
              // TODO: replace `user` and `pass` values from <https://forwardemail.net>
              user: config.EMAIL_USER,
              pass: config.EMAIL_PASS
            }
          });

       const send=await setup.sendMail({
            from:config.EMAIL_USER,
            to:to,
            html:email,
            subject:subject
        });

        return send;


    }

    public async makeRequest(url:string,method:string,data:any={},header:any){
        return new Promise(async (resolve, reject)=>{
            const param={
                method:method,
                headers:header
            };
            method!='GET'?param['body']=JSON.stringify(data):'';
            fetch(url,param).then(resp=>{
                return resp.json();
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
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

    public async uploadImage(path:string,user:string, file:string, reduce:boolean=false):Promise<string>{
        const decodeBase64Image=(dataString:string):Promise<any>=> {
           // console.log('file: ', dataString)
            return new Promise((resolve,reject)=>{
               // var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
                //var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,/),
                const matches=dataString.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/),
                response :any= {};
          // console.log('match: ',dataString.replace(/^data:([A-Za-z-+/]+);base64,/, ''))
              if (!matches.length) {
                reject (new Error('Invalid input string'))
              }
            
              response.type = matches[1];
              response.data = new Buffer(dataString.replace(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/, ''), 'base64');
            //console.log(response)
              resolve(response);
            })
          }
        return new Promise(async (resolve,reject)=>{
 try{
    var decodedImg =await decodeBase64Image(file);
    // console.log(decodedImg)
  var imageBuffer = decodedImg.data;
  var type = decodedImg.type;
  var extension = mime[type];
  //console.log(extension)
  const date=new Date().getTime()+this.genToken();
  var fileName =  date+user+"upload." + extension.extensions[0];

    const write=fs.writeFileSync(path + fileName, imageBuffer, 'utf8');
    resolve(fileName);
 }
catch(err){
    //console.log(err)
reject(err)
}
        })
    }


    public async deleteFile(path:string, name:string){
        return new Promise<string>((resolve, reject) => {

            fs.unlinkSync(path+name)
            resolve('done');
        })
    }

    //optimized for case of missing images in server
    public async deleteMultipleFile(file:Array<string>):Promise<string>{
        return new Promise<string>(async (resolve, reject) => {
            const deleted=[];
            try {
                
                file.forEach((res:any,index:number)=>{
                    //for errors and missing files, write a sequence to ignore
                    //get the path and name
                    // const pather=path.resolve(__dirname,`../${res.split('src/')[1]}`);
                    const pather=`src/${res.split('src/')[1]}`;
                   // console.log('here the path: ',pather)
                    fs.unlinkSync(pather)
                    deleted.push(res)
                })
                resolve('done'); 
            } catch (error) {
                //remove the errored file and repush
                let deler:Array<any>;
                const rem=file.filter(res=>`src/${res.split('src/')[1]}`!=error.path);
                //if there are some deleted, remove them from the sent file and continue deleting
                if(deleted.length>0){
                deler=rem.filter(res=>{
                    return !deleted.includes(res);
                })
                }
                else{
                    deler=rem
                }
                
                if(deler.length==0){
                // console.log(deler)
                    //resolve('done')
                }
                else{
                    //console.log('errored',deleted);
                    
                    await this.deleteMultipleFile(rem)
                }
               
               resolve(error) 
            }
        })
    }

    public loop=async (file:Array<string>,user:string, path:string,url:string):Promise<Array<string>>=>{
        return new Promise((resolve,reject)=>{
            const data=[];
            file.forEach(async (res,index)=>{
                const process=await this.uploadImage(path,user,res);
                const image=url+'/'+path+process;
                data.push(image);
            });
            resolve(data);
        })
       }

        //detect face
  public detectFace=async (file:string):Promise<any>=> {
    return new Promise(async(resolve,reject)=>{
    try { 

        //turn the base 64 into a fil
        const { Canvas, Image, ImageData } :any= canvas
        faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
        const img:any=new canvas.Image();
        img.src=file;
        await faceapi.nets.faceLandmark68Net.loadFromDisk('./public/models');
        await faceapi.nets.ssdMobilenetv1.loadFromDisk('./public/models');
        const detect=await faceapi.detectSingleFace(img);
        //console.log(detect)
        resolve(detect)
    }
    catch (err) {
        console.log(err)
      reject (err)
    } 
    })
  }

  public genToken=():string=>{
    return [...Array(30)]
    .map((e) => ((Math.random() * 36) | 0).toString(36))
    .join('');
  }

  public restartService=():void=>{
        cluster.emit('exit',{});
  }
}

export default new action();