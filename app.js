import express from 'express';
import cors from 'cors'

const app = express();

// middleware
app.use(cors())


const PORT = 4000;

import indexRouter from './routes/index.js';

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})

app.use('/api/', indexRouter);

