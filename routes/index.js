import { Router } from "express";
import Pool from 'pg-pool'

const router = Router();
const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'monsuu',
    user: 'deemdb',
    password: '1234'
})

router.get('/', async (req, res, next)=>{
    try {
        pool.query(`SELECT json_agg(monsuu.Products.*) FROM monsuu.Products`, (err, result)=>{
            res.json(result.rows[0].json_agg);
        })
    } catch (error) {
        res.send(error);
    }
})


router.get('/about', async(req, res)=>{
    try {
        res.send('{"message": "Hello about"}')
    } catch (error) {
        res.send(error);
    }
})

export default router;