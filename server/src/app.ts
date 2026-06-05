import dotenv from 'dotenv';
dotenv.config();
import express, {Application, Request, Response, NextFunction  } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes"; 
import userRoutes from './routes/user.routes'
import path from 'path';


const app: Application = express()
const PORT: number = Number(process.env.PORT) || 3000

app.use(cors({origin: 'http://localhost:5173', credentials: true}))
app.use(express.json());


app.get('/h', (req: Request, res:Response)=>{
    res.status(200).json({
        status: 'success',
        message: 'lucreaza!',
        timestamp: new Date().toISOString()
    })
})


app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)




app.use((req: Request, res: Response) =>{
    res.status(404).json({error: `${req.originalUrl} not found`})
})

app.listen(PORT, ()=>{
    console.log(`server start on url: http://localhost:${PORT}`)
})


export default app



