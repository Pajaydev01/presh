"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connect_js_1 = __importDefault(require("../database/connection/connect.js"));
class helper {
    constructor() {
        this.insert = (table, data) => {
            return new Promise((resolve, reject) => {
                const con = connect_js_1.default.creatConnection();
                con.query(`INSERT INTO ${table} SET ?`, data).then((resp) => {
                    //  con.end();
                    resolve(resp);
                }).catch((err) => {
                    con.end();
                    reject(err);
                });
            });
        };
        this.insertMultiple = (table, data) => {
            return new Promise((resolve, reject) => {
                const con = connect_js_1.default.creatConnection();
                const queries = [];
                data.forEach(async (resp) => {
                    queries.push(con.query(`INSERT INTO ${table} SET ?`, resp));
                });
                //console.log(queries)
                Promise.all(queries).then((resp) => {
                    //  con.end();
                    resolve(resp);
                }).catch((err) => {
                    con.end();
                    reject(err);
                });
            });
        };
        this.update = (table, data, where) => {
            return new Promise((resolve, reject) => {
                const con = connect_js_1.default.creatConnection();
                let query;
                query = [con.query(`UPDATE ${table} SET ? WHERE ?`, [data, where])];
                Promise.all(query).then((res) => {
                    //con.end()
                    resolve(res);
                }).catch((err) => {
                    con.end();
                    reject(err);
                });
            });
        };
        this.select = (table, column, where = null, whereType = 'AND' || 'OR', order = '', direction = '') => {
            return new Promise((resolve, reject) => {
                const con = connect_js_1.default.creatConnection();
                const col = column.length == 0 ? '*' : column;
                const query = !where ? con.query(`SELECT ${col} FROM ${table} ${order != '' ? 'ORDER BY ' + order + ' ' + direction : ''}`) : con.query(`SELECT ${col} FROM ${table} ${'WHERE ' + this.filter(where, whereType)} ${order != '' ? 'ORDER BY ' + order + ' ' + direction : ''}`);
                query.spread((res) => {
                    // con.end();
                    resolve(res);
                }).catch(err => {
                    con.end();
                    reject(err);
                });
            });
        };
        this.filter = (item, type) => {
            let query = [];
            for (let index = 0; index < item.length; index++) {
                const element = item[index];
                for (const key in element) {
                    if (Object.prototype.hasOwnProperty.call(element, key)) {
                        const resp = element[key];
                        const itemer = key + " = " + "'" + resp + "'";
                        query.push(itemer);
                    }
                }
            }
            const res = query.toString().split(',').join(` ${type} `);
            return res;
        };
    }
}
exports.default = new helper();
//# sourceMappingURL=helper.js.map