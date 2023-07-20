import actionService from "./actionService";
import { config } from "../config/config";
import { resolve } from "path";

class financeService{
    private header():Object{
        const key=config.ENVIRONMENT=='TEST'?config.FINCRA_TEST_API_KEY:config.FINCRA_LIVE_API_KEY;
        const header={
            "accept": "application/json",
            "content-type": "application/json",
            "api-key":key
        };
        return header;
    }
    //virtual account creation first
    public async createVirtualAccount(firsname:string,lastname:string,bvn:string,dob:string):Promise<any>{
    return new Promise(async (resolve,reject)=>{
        try {
            const url=config.ENVIRONMENT=="TEST"?config.FINCRA_TEST_URL+'profile/virtual-accounts/requests':config.FINCRA_LIVE_URL+'profile/virtual-accounts/requests';
            const payload={
                "currency": "NGN",
                "accountType": "individual",
                "KYCInformation": {
                    "firstName": firsname,
                    "lastName": lastname,
                    "bvn": bvn
                },
                "dateOfBirth":dob,
                "channel": config.FINCRA_CHANNEL
            };
            //make the call
            const call=await actionService.makeRequest(url,'POST',payload,this.header());
           // console.log(call)
            resolve(call);
        } catch (error) {
         //  console.log(error)
           reject (error); 
        }
    });
    }

    public async createCheckout(amount:number,customer:string,email:string):Promise<any>{
        return new Promise(async (resolve,reject)=>{
            try {
                const url=config.ENVIRONMENT=="TEST"?config.FINCRA_TEST_URL+'checkout/payments':config.FINCRA_LIVE_URL+'checkout/payments';
                const headers=this.header();
                headers['x-pub-key']=config.ENVIRONMENT=="TEST"?config.FINCRA_PUBLIC_KEY_TEST:config.FINCRA_PUBLIC_KEY_LIVE;
                headers['x-business-id']=config.FINCRA_BUSINESS;
                const payload={
                    "currency": "NGN",
                    "customer": {
                        "name": customer,
                        "email": email
                    },
                    "amount": amount
                };
                //make request
                const request=await actionService.makeRequest(url,'POST',payload,headers);
                resolve(request)
            } catch (error) {
                reject(error)
            }
        })
    }

    public async confirmCheckout(reference:any, multiple:boolean=false):Promise<any>{
        return new Promise(async (resolve,reject)=>{
            const header=this.header();
            header['x-business-id']=config.FINCRA_BUSINESS;
            try {
                if(multiple){
//bundle all the request here
const requests=[];
reference.forEach((res)=>{
    const url=config.ENVIRONMENT=="TEST"?config.FINCRA_TEST_URL+`checkout/payments/merchant-reference/${res.reference}`:config.FINCRA_LIVE_URL+`checkout/payments/merchant-reference/${res.reference}`;
    requests.push(actionService.makeRequest(url,'GET',{},header));
});
Promise.all(requests).then(res=>{
   // console.log(res)
    resolve(res);
    return;
}).catch(err=>{
    reject(err);
    return;
});
                }
                else{
            const url=config.ENVIRONMENT=="TEST"?config.FINCRA_TEST_URL+`checkout/payments/merchant-reference/${reference}`:config.FINCRA_LIVE_URL+`checkout/payments/merchant-reference/${reference}`;
            //console.log(url)
            //make the call
            const request=await actionService.makeRequest(url,'GET',{},header);
            resolve(request);
            }
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default new financeService();