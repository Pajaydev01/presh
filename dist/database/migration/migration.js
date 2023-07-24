"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connect_js_1 = __importDefault(require("../connection/connect.js"));
const node_events_1 = __importDefault(require("node:events"));
class initiate {
    //from the constructor, make the connections, exit the process on the last one
    constructor() {
        this.run = () => {
            let parent = this;
            const con = connect_js_1.default.loadConnection();
            //add all tables here to create them
            const query = [
                con.query("CREATE TABLE users(id int(11) NOT NULL AUTO_INCREMENT,email varchar(50) UNIQUE NOT NULL,phone varchar(50) UNIQUE NOT NULL,firstname text NOT NULL, lastname text NOT NULL,password varchar(60),created_at timestamp, PRIMARY KEY (id)) ENGINE=InnoDB"),
                con.query("CREATE TABLE savings(id int(11) NOT NULL AUTO_INCREMENT,user_id varchar(50) NULL,balance int(50) NULL,created_at timestamp, updated_at timestamp NULL, PRIMARY KEY (id)) ENGINE=InnoDB"),
                con.query("ALTER TABLE `users` ADD `salt` TEXT NULL AFTER `created_at`"),
                con.query("ALTER TABLE `users` CHANGE `password` `password` LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL"),
                con.query("CREATE TABLE transactions(id int(11) NOT NULL AUTO_INCREMENT,user_id varchar(50) NOT NULL,amount int(50) NULL,type TEXT NOT NULL,description TEXT NULL, charges int(50) NULL,created_at timestamp,updated_at timestamp NULL, PRIMARY KEY (id)) ENGINE=InnoDB"),
                con.query("ALTER TABLE `savings` CHANGE `balance` `balance` VARCHAR(5000) NOT NULL"),
                con.query("ALTER TABLE `transactions` CHANGE `amount` `amount` VARCHAR(5000) NOT NULL"),
                con.query("CREATE TABLE uploads(id int(11) NOT NULL AUTO_INCREMENT,path text NOT NULL,user_id text NOT NULL,created_at timestamp, PRIMARY KEY (id)) ENGINE=InnoDB"),
                con.query("ALTER TABLE `uploads` ADD `name` text NOT NULL"),
                con.query("ALTER TABLE `transactions` ADD `t_id` text NOT NULL"),
                con.query("CREATE TABLE wallet(id int(11) NOT NULL AUTO_INCREMENT,user_id varchar(50) NOT NULL,accountNumber int(50) NOT NULL,accountName TEXT NOT NULL,bankName TEXT NOT NULL, reference varchar(50) NOT NULL, virtualId varchar(50) NOT NULL,created_at timestamp,updated_at timestamp NULL, PRIMARY KEY (id)) ENGINE=InnoDB"),
                con.query("ALTER TABLE `wallet` ADD `bankCode` int(50) NOT NULL"),
                con.query("ALTER TABLE `wallet` CHANGE `accountNumber` `accountNumber` VARCHAR(5000) NOT NULL"),
                con.query("ALTER TABLE `wallet` ADD `balance` varchar(1000) NOT NULL"),
                con.query("CREATE TABLE checkouts(id int(11) NOT NULL AUTO_INCREMENT,user_id varchar(50) NOT NULL,amount int(50) NULL,status BOOLEAN NOT NULL,reference TEXT NULL,created_at timestamp,updated_at timestamp NULL, PRIMARY KEY (id)) ENGINE=InnoDB"),
                con.query("CREATE TABLE `apiUsers`(id int(11) NOT NULL AUTO_INCREMENT,username TEXT NOT NULL,token varchar(1000) NULL,created_at timestamp,updated_at timestamp NULL, PRIMARY KEY (id)) ENGINE=InnoDB")
            ];
            return new Promise((resolve, reject) => {
                //  console.log(query)
                //Promise.
                Promise.allSettled(query).then((res) => {
                    // console.log(res)
                    resolve(res);
                }).catch((err) => {
                    //console.log(err)
                    reject(err);
                });
            });
        };
        this.event = new node_events_1.default();
        this.run().then((res) => {
            // console.log(res)
            console.log('Migration completed with no errors');
            console.log('exiting..');
            process.exit(1);
        }).catch((err) => {
            // console.log(err)
            console.log('Migration completed with few existing tables');
            console.log('exiting..');
            process.exit(1);
            //console.log(err)
        });
    }
}
new initiate();
//# sourceMappingURL=migration.js.map