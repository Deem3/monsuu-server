import { Router } from "express";
import * as dotenv from 'dotenv';
import bcrypt from 'bcrypt';
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

// Register

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Check if user already exists
      const userExists = await pool.query(
        'SELECT * FROM monsuu.users WHERE username = $1',[username]
      );
  
      if (userExists.rows.length > 0) {
        return res.status(409).send('User already exists');
      }

      //generate salt
      const salt = await bcrypt.genSalt(10);
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Insert new user into database
      const newUser = await pool.query(
        'INSERT INTO monsuu.users (username, password) VALUES ($1, $2) RETURNING _id',[username, hashedPassword]
      );
  
      const token = jwt.sign({ user_id: newUser.rows[0]._id }, process.env.JWT_SECRET, {expiresIn: '1h'})

      res.cookie('token', token, { httpOnly: true, maxAge: 3600, domain: 'http://localhost:3000' })
      res.json({ token})


    } catch (err) {
        res.status(401).json('Something went wrong');
    }
  });


// Login
const findUser = async (username) => {
    const user = await pool.query(`SELECT * FROM monsuu.users WHERE username = $1`, [username]);
    return user;
}

const checkPassword = async (password, hash) => {
    const match = await bcrypt.compare(password, hash);
    return match;
}

const createToken = (user_id) => {
    const token = jwt.sign({ user_id }, process.env.JWT_SECRET, {expiresIn: '1h'})
    return token;
}

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        console.log('username', username)
        const user = await findUser(username);
        if(user.rows.length === 0) {
            console.log('User not found')
            return res.status(401).json('Username or password incorrect');
        }
        const match = await checkPassword(password, user.rows[0].password);

        if(!match) {
            console.log('Passwords do not match')
            return res.status(401).json('Username or password incorrect');
        }

        const token = createToken(user.rows[0]._id)

        // res.status(201).json({ token })
    //   res.status(200).cookie('token', token, { httpOnly: true });
        res.cookie('token', token, { httpOnly: true, maxAge: 3600, domain: 'http://localhost:3000'})
        res.json({ token})

    } catch (error) {
        console.log('Error', error)
        res.status(401).json('Username or password incorrect');
    }
})

export default router;