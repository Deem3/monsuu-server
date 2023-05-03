import express from 'express';
import cors from 'cors'
import * as dotenv from 'dotenv';

const app = express();
dotenv.config()

// middleware
app.use(cors())

app.use(express.json())

app.use((req, res, next)=>{
    console.log(req.path, req.method)
    next()
})


import indexRouter from './routes/index.js';

app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})

app.use('/api/', indexRouter);

