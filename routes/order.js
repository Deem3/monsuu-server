import {Router} from 'express'
import Pool from 'pg-pool'
import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';


dotenv.config()

const router = Router();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
})


// post order

/**
 * @openapi
 * /order:
 *  post:
 *       summary: Create a new order
 *       security:
 *         - app_id: []
 *       tags:
 *          - order
 *       requestBody:
 *              description: Create a new order
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              district:
 *                                  type: string
 *                                  description: district
 *                              khoroo:
 *                                  type: string
 *                                  description: khoroo
 *                              apartment:
 *                                  type: string
 *                                  description: apartment
 *                              phone:
 *                                  type: string
 *                                  description: phone
 *                              price:
 *                                  type: number
 *                                  description: price
 *       responses:
 *          200:
 *              description: Success
 *          400:
 *              description: Bad request
 *          401:
 *              description: Unauthorized
 */

router.post('/', async (req, res)=>{
    const {district, khoroo, apartment, phone, products, price} = req.body
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
        pool.query(`SELECT monsuu.products.* from monsuu.products`, (err, result)=>{
            let totalPrice = 0
            let quantity = 0
                result.rows.forEach(product=>{
                    if(products[product._id]!=undefined){
                        totalPrice += products[product._id]*product.price
                        quantity += products[product._id]
                    }
                })
                if(totalPrice===price){
            pool.query(`INSERT INTO monsuu.order(district, khoroo, apartment, phone, quantity, price, uid) VALUES($1, $2, $3, $4, $5, $6, $7)`, [district, khoroo, apartment, phone, quantity, totalPrice, 12347], (err, result)=>{
                if(err){
                    console.log(err)
                }
                console.log('success')
            })}
        })}
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
    
})
export default router

/**
 * components:
 *    securitySchemes:
 *      app_id:
 *          type: apiKey
 *          description: API key to authorize requests.
 *          name: appid
 *          in: query
 * 
 */