interface request{
    body:{},
    query:{}
}
class mainHelper{

    public run=(req:request, required:Array<string>): boolean=>{
      //check if the request has the array
        //to make things less complex, collect the keys in the request to another array
        let payload;
        if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
            if(req.query.constructor === Object && Object.keys(req.query).length === 0){
payload={}
            }
            else{
                payload=req.query
            }
          }
          else{
            payload=req.body;
          }
        const arr=[];
        for (const key in payload) {
            if (Object.prototype.hasOwnProperty.call(payload, key)) {
                arr.push(key);
            }
        }

        //filter the request by number of request
        let truth=[];
       arr.forEach((res:any,index:number)=>{
        truth.push(required.includes(res))
       });

       // do a check to confirm the false params are actually required
       truth.forEach((element:any, index:number) => {
        if(element==false){
            //console.log(index)
            if(!required.includes(arr[index])){
                //remove from the array
                truth.splice(index,1);
                arr.splice(index,1);
                
            }
        }
       });

       //now, filter the remaining guys against the required parameter
       required.forEach((res:any,index:number)=>{
        truth.push(required.includes(arr[index]))
       });
       //console.log(truth)
     let res:boolean;
     //sed result
     return truth.includes(false)?false:true;
    }
}

export default mainHelper;