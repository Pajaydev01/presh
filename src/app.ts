import express from 'express';
import cors from 'cors';
import {router} from './router/route.js';
import connect from './database/connection/connect.js';
import { config } from './config/config.js';
const app = express();
const port = config.PORT || 1000;
app.use(express.json({limit:'5000mb'}));
app.use(express.urlencoded({limit: '5000mb'}));
app.use(express.json());
app.use(cors({
    credentials:true,
    methods:'GET,HEAD,PUT,PATH,POST,DELETE',
    preflightContinue:false,
    origin:'*'
}));
app.get('/', (req, res) => {
  res.send('Welcome to the typescript powered api');
});


app.use('/api',router);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

//fire db
connect.creatConnection;