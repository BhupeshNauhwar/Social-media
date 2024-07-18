import express  from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import dbConnection from './dbConfig/dbConnect.js';
import helmet from 'helmet';

dotenv.config();

const app=express();

const PORT=process.env.PORT || 8800;
dbConnection();


app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({extended:true}));

app.use(morgan("dev"));


app.listen(PORT,()=>{
    console.log(`Server Started At http://localhost:${PORT}`);
})
