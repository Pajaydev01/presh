interface request{
    body:{}
}
class mainHelper{

    public run=(req:request, required:Array<string>): boolean=>{
      //check if the request has the array
        //to make things less complex, collect the keys in the request to another array
        const arr=[];
        for (const key in req.body) {
            if (Object.prototype.hasOwnProperty.call(req.body, key)) {
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