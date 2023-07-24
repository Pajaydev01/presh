import express from 'express';
import cors from 'cors';
import {router} from './router/route.js';
import connect from './database/connection/connect.js';
import { config } from './config/config.js';
const app = express();
const port = config.PORT || 1000;
import cluster from 'node:cluster';
import * as  os from 'os';
import http from 'node:http';
app.use(express.json({limit:'5000mb'}));
app.use(express.urlencoded({limit: '5000mb'}));
app.use(express.json());
app.use(cors({
    credentials:true,
    methods:'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue:false,
    origin:'*'
}));
app.get('/', (req, res) => {
  res.send('Welcome to the typescript powered api');
});


app.use('/api',router);

//use the processes
if(cluster.isPrimary){
  const cpus=os.cpus().length;
  console.log('No of process to start: ', cpus);
  for (let index = 0; index < cpus; index++) {
    cluster.fork();
  }

  cluster.on('exit',(worker,code,signal)=>{
    console.log(`this worker died with process id: ${worker}, code : ${code} and signal: ${signal}`);

    //restart service
    console.log('restarting service');
    setTimeout(()=>{
      cluster.fork();
    },5000)
  })
}else{
  const apper=http.createServer(app);
  apper.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
  });
}

//fire db
connect.creatConnection();