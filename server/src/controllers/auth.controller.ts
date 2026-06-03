import { OAuth2Client } from "google-auth-library";
import {Request, Response} from 'express';
import {prisma} from '../config/prisma';
import jwt from 'jsonwebtoken';
import { error } from "node:console";
import bcrypt from 'bcryptjs';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export const googleLoginHandler = async (req: Request, res: Response): Promise<any> =>{
    const {idToken} = req.body

    if(!idToken){
        return res.status(400).json({error: 'need idToken'})
    }

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        })

        const payload = ticket.getPayload()
        if(!payload || !payload.email){
            return res.status(400).json({error: 'google token not found'})
        }

        const {email, name, picture, sub: googleId} = payload


        const user = await prisma.user.upsert({
            where: {googleId: googleId},
            update: {
                name: name,
                avatar: picture,
            },
            create: {
                email: email,
                name: name,
                avatar: picture,
                googleId: googleId,
                role: 'dev'
            },
        })

        const appToken = jwt.sign(
            {userId: user.id, email: user.email, role: user.role},
            process.env.JWT_SECRET || 'fallback_secret',
            {expiresIn: '2d'}
        )

        return res.status(200).json({
            message: 'google auth success',
            token: appToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                role: user.role
            }
        })
    

    } catch(error){
        console.error('back-end error: ', error)
        return res.status(401).json({error: 'google verification doesn`t work'})
    }

}


export const registerHandler = async (req: Request, res: Response): Promise<any> =>{
    const {email, name, password} = req.body

    if(!email || !password || !name){
        res.status(400).json({error: 'credentials are required'})
    }

    try{
        const existing = await prisma.user.findUnique({where: {email}})
        if(existing){
            return res.status(409).json({error: 'account with this email already exists'})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: {email, name, password: hashedPassword, role: 'dev'}
        })

        const appToken = jwt.sign(
            {userId: user.id, email: user.email, role: user.role},
            process.env.JWT_SECRET || 'fallback_secret',
            {expiresIn: '2d'}
        )

        return res.status(201).json({
            message: 'account was created successfuly',
            token: appToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                role: user.role
            }
        })



    }catch(error){
        console.error('back-end error: ', error)
        return res.status(500).json({error: 'registration failed'})
    }
}



export const loginHandler = async (req: Request, res: Response): Promise<any> => {
    const {email, password} = req.body

    if(!email || !password){
        res.status(400).json({error: 'email & password are required'})
    }


    try{
        const user = await prisma.user.findUnique({where: {email}})

        if(!user || !user.password){
            return res.status(401).json({error: 'invalid credentials'})
        }

        const isValid = await bcrypt.compare(password, user?.password)
        if(!isValid){
            return res.status(401).json({error: 'invalid credentials'})
        }

        const appToken = jwt.sign(
            {userId: user.id, email: user.email, role: user.role},
            process.env.JWT_SECRET || 'fallback_secret',
            {expiresIn: '2d'}
        )

        return res.status(200).json({
            message: 'account was created successfuly',
            token: appToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                role: user.role
            }
        })




    }catch{error}{
        console.error('back-end error: ', error)
        return res.status(500).json({error: 'google verification doesn`t work'})
    }
}
