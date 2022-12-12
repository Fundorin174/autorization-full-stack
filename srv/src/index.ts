require('dotenv').config();
import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes';
import errorMiddleware from './middlewares/error-middleware';

const  PORT =process.env.PORT || 5000;

const app: Express = express()
app.use(express.json());
app.use('/api', userRouter);
app.use(cookieParser());
app.use(cors());
app.use(errorMiddleware);

const start = async () =>{
    try {
        app.listen(PORT, ()=>console.log(`server is running on port: ${PORT}`))

    } catch (e) {
        console.log(e)
    }
}

start();