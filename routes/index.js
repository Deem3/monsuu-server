import { Router } from "express";
import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

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

// localhost:4000/api/

/**
 * @openapi
 * /api/:
 *  get:
 *      summary: get all products
 *      tags:
 *          - product
 *      description: Welcome to monsuu api
 *      responses:
 *          200: 
 *              description: Success
 *          500: 
 *              description: Error
 */

// method: get post; url: /, /:id

// localhost:4000/api/
router.get('/', async (req, res, next)=>{
    try {

        pool.query(`SELECT json_agg(monsuu.Products.*) FROM monsuu.Products`, (err, result)=>{
            res.set('Cache-Control', 'public, max-age=1000')
            res.json(result.rows[0].json_agg);
        })
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
})

// get a product by id


// localhost:4000/api/1

/**
 * @openapi
 * /api/{id}:
 *  get:
 *      summary: get product by id
 *      tags:
 *          - product
 *      parameters:
 *        - in: path
 *          name: id
 *          description: get product
 *          required: true
 *          type: integer
 *      responses:
 *          200: 
 *              description: Success
 *          500: 
 *              description: Error
 */

// localhost:4000/api/product
// locaholst:4000/api/
router.get('/:id', async (req, res, next)=>{
    const {id} = req.params;
    try {

        pool.query(`SELECT json_agg(monsuu.Products.*) FROM monsuu.Products WHERE _id = $1`, [id] , (err, result)=>{
            res.status(200).json(result.rows[0].json_agg);
        })
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
})

// post a product

// localhost:4000/api/

/**
 * @openapi
 * /api/:
 *  post:
 *      summary: create new product
 *      tags:
 *          - product
 *      requestBody:
 *          description: get product
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          _id:
 *                              type: integer
 *                              description: id
 *                          name:
 *                              type: string
 *                              description: name
 *                          weight:
 *                              type: integer
 *                              description: weight
 *                          img:
 *                              type: string
 *                              description: img
 *                          price:
 *                              type: integer
 *                              description: price
 *                          pkg:
 *                              type: string
 *                              description: package
 *                          calorie:
 *                              type: integer
 *                              description: calorie
 *                          keep_date:
 *                              type: integer
 *                              description: date
 *                          keep_condition:
 *                              type: string
 *                              description: condition
 *                          product_advantage:
 *                              type: string
 *                              description: advantage
 *                          pros:
 *                              type: string
 *                              description: pros
 *      responses:
 *          200: 
 *              description: Success
 *          500: 
 *              description: Error
 */
router.post('/', async (req, res, next)=>{
    const {_id, name, weight, img, price, pkg, calorie, keep_date, keep_condition, product_advantage, pros} = req.body;
    try {

            // get a token from the request headers
            const token = req.headers.authorization;

            if(token === 'undefined'){
                console.log('you are not authorized user')
            }

            // then decoding the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);


            // then getting the user_id from the decoded token
            const user_id = decoded.user_id;
            

            // then checking if the user exists in the database
            const dbUser = await pool.query(`SELECT * FROM monsuu.users WHERE _id = $1`, [user_id]);
            if(dbUser.rows.length === 0) {
                return res.status(401).json('Username or password incorrect');
            }
        if(dbUser.rows.length > 0){
        pool.query(`INSERT INTO
                    monsuu.Products(_id, name, weight, img, price, package, calorie, keep_date, keep_condition, product_advantage, pros)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                    [_id, name, weight, img, price, pkg, calorie, keep_date, keep_condition, product_advantage, pros] , (err, result)=>{
                        
                        if(err){
                            console.error(err)
                        }

            res.json(`${name} added successfully`);
        })}


    } catch (error) {

        res.status(400).json({ success: false, message: error.message });

    }
})

// update product

/**
 * @openapi
 * /api/{id}:
 *  put:
 *      summary: edit existing product
 *      tags:
 *          - product
 *      parameters:
 *        - in: path
 *          name: id
 *          description: id
 *          required: true
 *          type: integer
 *      requestBody:
 *          description: get product
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          _id:
 *                              type: integer
 *                              description: id
 *                          name:
 *                              type: string
 *                              description: name
 *                          weight:
 *                              type: integer
 *                              description: weight
 *                          img:
 *                              type: string
 *                              description: img
 *                          price:
 *                              type: integer
 *                              description: price
 *                          pkg:
 *                              type: string
 *                              description: package
 *                          calorie:
 *                              type: integer
 *                              description: calorie
 *                          keep_date:
 *                              type: integer
 *                              description: date
 *                          keep_condition:
 *                              type: string
 *                              description: condition
 *                          product_advantage:
 *                              type: string
 *                              description: advantage
 *                          pros:
 *                              type: string
 *                              description: pros
 *      responses:
 *          200: 
 *              description: Success
 *          500: 
 *              description: Error
 */

router.put('/:id', async(req, res, next)=>{
    const {id} = req.params;
    const {_id, name, weight, img, price, pkg, calorie, keep_date, keep_condition, product_advantage, pros} = req.body;
    
    try {

            // get a token from the request headers
            const token = req.headers.authorization;

            // then decoding the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // then getting the user_id from the decoded token
            const user_id = decoded.user_id;

            // then checking if the user exists in the database
            const dbUser = await pool.query(`SELECT * FROM monsuu.users WHERE _id = $1`, [user_id]);
            if(dbUser.rows.length === 0) {
                return res.status(401).json('Username or password incorrect');
            }

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

/**
 * @openapi
 * /api/{id}:
 *  delete:
 *      summary: delete product by id
 *      tags:
 *          - product
 *      parameters:
 *        - in: path
 *          name: id
 *          description: get product
 *          required: true
 *          type: integer
 *      responses:
 *          200: 
 *              description: Success
 *          500: 
 *              description: Error
 */
router.delete('/:id', async(req, res, next)=>{
    const {id} = req.params;
    try {
        pool.query(`DELETE FROM monsuu.Products WHERE _id = $1`, [id] , (err, result)=>{

            res.status(200).json(`${id} deleted successfully`);

        })


    } catch (error) {

        res.status(400).json({ success: false, message: error.message });

    }
})

export default router;