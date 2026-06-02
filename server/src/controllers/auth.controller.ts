import { OAuth2Client } from "google-auth-library";
import {Request, Response} from 'express';
import {prisma} from '../config/prisma';
import jwt from 'jsonwebtoken';


const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export const googleLoginHandler = async (req: Request, res: Response): Promise<any> =>{
    const {idToken} = req.body

    if(!idToken){
        return res.status(400).json({error: 'need itToken'})
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
            message: 'auth success',
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
        console.error('eroare back-end: ', error)
        return res.status(401).json({error: 'google verification doesn`t work'})
    }





}