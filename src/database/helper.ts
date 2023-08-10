import { table } from "console";
import connect from "../database/connection/connect.js";
interface objects{
}
interface where{
}
class helper{
    constructor(){

    }

    public insert=(table:string, data:objects)=>{
        return new Promise((resolve:any, reject:any)=>{
            const con=connect.loadConnection();
            con.query(`INSERT INTO ${table} SET ?`,data).then((resp)=>{
              //  con.end();
               resolve(resp)
            }).catch((err)=>{
                con.end();
                reject(err)
            })
        })
    }

    public insertMultiple=(table:string, data:Array<objects>)=>{
        return new Promise((resolve:any, reject:any)=>{
            const con=connect.loadConnection();
            const queries=[]
            data.forEach(async resp=>{
                queries.push(con.query(`INSERT INTO ${table} SET ?`,resp));
            });
            //console.log(queries)
            Promise.all(queries).then((resp)=>{
              //  con.end();
               resolve(resp)
            }).catch((err)=>{
                con.end();
                reject(err)
            })
        })
    }

    public update=(table:string,data:objects,where:where)=>{
        return new Promise((resolve:any,reject:any)=>{
            const con=connect.loadConnection();
            let query;
            query=[con.query(`UPDATE ${table} SET ? WHERE ?`,[data,where])];
            Promise.all(query).then((res:any)=>{
                //con.end()
                resolve(res)
            }).catch((err:any)=>{
                con.end()
                reject(err)
            })
        })
    }

    public select=(table:string,column:Array<string>,where:Array<{}>=null,whereType:string='AND' || 'OR',order:string='',direction:string=''):Promise<Array<[]>>=>{
        return new Promise((resolve:any,reject:any)=>{
            const con=connect.loadConnection();
            const col=column.length==0?'*':column;
            const query:any=!where?con.query(`SELECT ${col} FROM ${table} ${order!=''?'ORDER BY '+order+' '+direction:''}`):con.query(`SELECT ${col} FROM ${table} ${'WHERE '+this.filter(where,whereType)} ${order!=''?'ORDER BY '+order+' '+direction:''}`);
            query.spread((res:any)=>{
                // con.end();
                //console.log(res)
                resolve(res)
            }).catch(err=>{
                console.log(err)
                con.end();
                reject (err)
            })
        })
    }


    private filter=(item,type)=>{
        let query=[];
        for (let index = 0; index < item.length; index++) {
            const element = item[index];
            for (const key in element) {
                if (Object.prototype.hasOwnProperty.call(element, key)) {
                    const resp = element[key];
                    const itemer=key+" = "+"'"+resp+"'";
                    query.push(itemer)
                }
            }
        }
        const res=query.toString().split(',').join(` ${type} `);
        return res

    }
}

export default new helper();