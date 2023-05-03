import { Router } from "express";

const router = Router();

router.get('/', async (req, res, next)=>{
    try {
        res.send('{"message": "Hello World"}')
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