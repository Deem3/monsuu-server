import { Router } from "express";
import * as dotenv from 'dotenv';

import Pool from 'pg-pool'

dotenv.config()

const router = Router();
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
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

export default router;