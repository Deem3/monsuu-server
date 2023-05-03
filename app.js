import express from 'express';

const app = express();

const PORT = 3000;

import indexRouter from './routes/index.js';

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})

app.use('/api/', indexRouter);

