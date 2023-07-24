"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_js_1 = require("../../config/config.js");
const db = require('mysql-promise')();
class connect {
    constructor() {
        this.creatConnection = () => {
            // const db=require('mysql-promise')();
            const con = db.configure({
                host: config_js_1.config.HOST,
                user: config_js_1.config.USERNAME,
                password: config_js_1.config.PASSWORD,
                database: config_js_1.config.DATABASE,
            });
            return db;
        };
        this.loadConnection = () => {
            //this.creatConnection();
            return this.creatConnection();
        };
        //connect to db
    }
}
exports.default = new connect();
//# sourceMappingURL=connect.js.map