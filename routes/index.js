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

// get all products

router.get('/', async (req, res, next)=>{
    try {
        pool.query(`SELECT json_agg(monsuu.Products.*) FROM monsuu.Products`, (err, result)=>{
            res.json(result.rows[0].json_agg);
        })
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
})

// get a product by id

router.get('/:id', async (req, res, next)=>{
    const {id} = req.params;
    try {
        pool.query(`SELECT json_agg(monsuu.Products.*) FROM monsuu.Products WHERE _id = ${id}`, (err, result)=>{
            res.status(200).json(result.rows[0].json_agg);
        })
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
})

// post a product

router.post('/', async (req, res, next)=>{
    const {_id, name, weight, img, price, pkg, calorie, keep_date, keep_condition, product_advantage, pros} = req.body;
    try {
        pool.query(`INSERT INTO monsuu.Products(_id, name, weight, img, price, package, calorie, keep_date, keep_condition, product_advantage, pros) VALUES (${_id}, '${name}', '${weight}', '${img}', ${price}, '${pkg}', ${calorie}, '${keep_date}', '${keep_condition}', '${product_advantage}', '${pros}')`, (err, result)=>{
            res.send(`${name} added successfully`);
        })
    } catch (error) {
        res.status(400).json({ msg: error.message });
        
    }
})

// update product
router.put('/:id', async(req, res, next)=>{
    const {id} = req.params;
    const {_id, name, weight, img, price, pkg, calorie, keep_date, keep_condition, product_advantage, pros} = req.body;
    
    try {
        const result = await pool.query(`
            UPDATE monsuu.Products
            SET _id = $1, name = $2, weight = $3, img = $4, price = $5, package = $6, calorie = $7, keep_date = $8, keep_condition = $9, product_advantage = $10, pros = $11
            WHERE _id = $12
            RETURNING *
        `, [_id, name, weight, img, price, pkg, calorie, keep_date, keep_condition, product_advantage, pros, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: `Product with id ${id} not found` });
        }

        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
})

// delete product
router.delete('/:id', async(req, res, next)=>{
    const {id} = req.params;
    try {
        pool.query(`DELETE FROM monsuu.Products WHERE _id = ${id}`, (err, result)=>{
            res.send(`${id} deleted successfully`);
        })
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
})

export default router;