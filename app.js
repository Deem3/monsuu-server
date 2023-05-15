import express from 'express';
import cors from 'cors'
import * as dotenv from 'dotenv';
import coookieParser from 'cookie-parser';

const app = express();
dotenv.config()

// middleware

app.use(cors())

app.use(coookieParser())

app.use(express.json())

app.use((req, res, next)=>{
    console.log(req.path, req.method)
    next()
})


import indexRouter from './routes/index.js';
import userRouter from './routes/login.js';

app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})

app.use('/api/', indexRouter);

app.use('/user/', userRouter);

