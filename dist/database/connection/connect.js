"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_js_1 = require("../../config/config.js");
const db = require('mysql-promise')();
class connect {
    constructor() {
        this.connect = null;
        this.creatConnection = () => {
            // const db=require('mysql-promise')();
            db.configure({
                host: config_js_1.config.HOST,
                user: config_js_1.config.USERNAME,
                password: config_js_1.config.PASSWORD,
                database: config_js_1.config.DATABASE,
            });
            this.connect = db;
            return db;
        };
        this.loadConnection = () => {
            //this.creatConnection();
            //   console.log(this.connect)
            return this.connect == null ? this.creatConnection() : this.connect;
        };
        //connect to db
    }
}
exports.default = new connect();
//# sourceMappingURL=connect.js.map