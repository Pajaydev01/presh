//import { MysqlError, Connection, createConnection, } from "mysql";
import * as createConnection from 'mysql-promise'
import { config } from "../../config/config.js";
declare var require: (arg0: string) => { (): any; new(): any; };
const db=require('mysql-promise')();
class connect{
    connect:any=null;
    constructor(){
        //connect to db
    }

    creatConnection=()=>{
       // const db=require('mysql-promise')();
        const con=db.configure({
            host:config.HOST,
            user:config.USERNAME,
            password:config.PASSWORD,
            database:config.DATABASE,

        });
        this.connect=con;
        return db;
    }

loadConnection=()=>{
        //this.creatConnection();
        return this.connect==null?this.creatConnection():this.connect;
    }

}
export default new connect();