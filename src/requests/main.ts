interface request {
    body: {},
    query: {}
}
class mainHelper {

    public run = (req: request, required: Array<string>): any => {
        //check if the request has the array
        //to make things less complex, collect the keys in the request to another array
        let payload;
        if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
            if (req.query.constructor === Object && Object.keys(req.query).length === 0) {
                payload = {}
            }
            else {
                payload = req.query
            }
        }
        else {
            payload = req.body;
        }
        const arr = [];
        // console.log('here payload: ',payload)
        for (const key in payload) {
            if (Object.prototype.hasOwnProperty.call(payload, key)) {
                arr.push(key);
            }
        }
        // console.log('array: ',arr)

        //filter the request by number of request
        let truth = [];
        arr.forEach((res: any, index: number) => {
            truth.push(required.includes(res))
        });

        // do a check to confirm the false params are actually required
        truth.forEach((element: any, index: number) => {
            if (!element) {
                //console.log(index)
                if (!required.includes(arr[index])) {
                    //remove from the array
                    truth.splice(index, 1);
                    arr.splice(index, 1);

                }
            }
        });
        // console.log('array: ',arr)
        const final = [];
        //now, filter the remaining guys against the required parameter
        required.forEach((res: any, index: number) => {
            // console.log(arr.includes(res))
            if (!arr.includes(res)) {
                //check that that param exists
                arr.includes(res) ? final.push(true) : final.push(false);
            }
            else {
                final.push(true);
            }
        });
        //console.log(final)

        const list = [];
        final.forEach((res: any, index: number) => {
            if (!res) {
                list.push(required[index])
            }
        });
        //console.log('missing: ',list)
        let res: boolean;
        //sed result
        return final.includes(false) ? list : true;
    }
}

export default mainHelper;