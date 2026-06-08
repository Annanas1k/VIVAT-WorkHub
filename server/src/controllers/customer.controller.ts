
import { Response } from "express"
import prisma from "../config/prisma"
import { AuthRequest } from "../middleware/auth.middleware"
import { JsonObject } from '../../generated/prisma/internal/prismaNamespace';
import path from 'path';

// ─────────────────────────────────────────
// GET /api/customers
// ─────────────────────────────────────────

export const getAllCustomersHandler = async (req: AuthRequest, res: Response): Promise<any> =>{
    try{
        const customers = await prisma.customer.findMany({
            include :{
                createdBy: {select: {id: true, name: true, avatar: true}},
                projects: {select: {id: true, name: true, status: true}}
            },
            orderBy: {createdAt: 'desc'}
        })

        return res.status(200).json({customers})
    }catch(error){
        console.error('getCustomers error: ', error)
        return res.status(500).json({error: 'server error'})
    }
}

// ─────────────────────────────────────────
// GET /api/customers/:id
// ─────────────────────────────────────────

export const getCustomerByIdHandler = async (req: AuthRequest, res: Response): Promise<any> =>{
    const {id} = req.body
    try {   
        const customer = await prisma.customer.findUnique({
            where: {id: Number(id)},
            include: {
                createdBy: {select: {id: true, name: true, avatar: true}},
                projects: {select: {id: true, name: true, status: true, dueDate: true}}
            }
        })

        if(!customer){
            res.status(404).json({error: 'customer dont found'})
        }

        return res.status(200).json({customer})
    }catch(error){
        console.error('getCustomerById error: ', error)
        return res.status(500).json({error: 'server error'})
    }
}

// ─────────────────────────────────────────
// POST /api/customers/
// ─────────────────────────────────────────
export const createCustomerHandler = async (req: AuthRequest, res: Response): Promise<any> =>{
    const {userId} = req.user!
    const {
        type, name, email, phone, address, notes,
        company, vatNumber, regNumber,
        firstName, lastName,
    } = req.body;

    if(!name) return res.status(400).json({error: 'customer name is required'})
    try{
        if(email){
            const existingEmail = await prisma.customer.findUnique({
                where: {email}
            })
            if(existingEmail) return res.status(409).json({error: 'An customer with this email already exists'})
        }

        if(phone){
            const existingPhone = await prisma.customer.findUnique({
                where: {phone}
            })
            if(existingPhone) return res.status(409).json({error: 'An customer with this phone already exists'})
        }

        const customer = await prisma.customer.create({
            data: {
                type: type || 'individual',
                name, email, address, phone, notes,
                company, vatNumber, regNumber,
                firstName, lastName,
                createdById: Number(userId)
            }
        })
        return res.status(201).json({customer})

    }catch(error){
        console.error('createCustomer error: ', error)
        return res.status(500).json({error: 'server error'})
    }
}

// ─────────────────────────────────────────
// PATCH /api/customers/:id
// ─────────────────────────────────────────
export const updateCustomerHandler = async (req: AuthRequest, res: Response): Promise<any> =>{
    const {id} = req.params
    const {userId} = req.user!
    const {
        type, name, email, phone, address, notes,
        company, vatNumber, regNumber,
        firstName, lastName,
    } = req.body;
    
    try {
        const customer = await prisma.customer.findUnique({where: { id: Number(id)}})
        if(!customer) return res.status(404).json({error: 'Customer not found'})

        const updateData: any = {};
        if (type !== undefined) updateData.type = type;
        if (name) updateData.name = name;
        if (address !== undefined) updateData.address = address;
        if (notes !== undefined) updateData.notes = notes;
        if (company !== undefined) updateData.company = company;
        if (vatNumber !== undefined) updateData.vatNumber = vatNumber;
        if (regNumber !== undefined) updateData.regNumber = regNumber;
        if (firstName !== undefined) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;
    
        if (email && email !== customer.email) {
        const taken = await prisma.customer.findUnique({ where: { email } });
        if (taken) return res.status(409).json({ error: 'Email already in use.' });
        updateData.email = email;
        }
    
        if (phone !== undefined && phone !== customer.phone) {
        if (phone !== '') {
            const taken = await prisma.customer.findFirst({
            where: { phone, NOT: { id: Number(id) } },
            });
            if (taken) return res.status(409).json({ error: 'Phone already in use.' });
        }
        updateData.phone = phone || null;
        }
    
        const updated = await prisma.customer.update({
        where: { id: Number(id) },
        data: updateData,
        });


        return res.status(200).json({customer: updated})
    }catch(error){
        console.error('updateCustomer error: ', error)
        return res.status(500).json({error: 'server error'})
    }
}


// ─────────────────────────────────────────
// DELETE /api/customers/:id
// ─────────────────────────────────────────
export const deleteCustomerHandler = async (req: AuthRequest, res: Response): Promise<any> =>{
    const {id} = req.params
    const {userId} = req.user!

    try{
        const customer = await prisma.customer.findUnique({where: {id: Number(id)}})
        if(!customer) return res.status(404).json({error: 'Customer not found'})
        
        await prisma.customer.delete({where: {id: Number(id)}})
        return res.status(200).json({message: `Customer: ${customer.name} was succesfully deleted`})
    }catch(error){
        console.log('deleteCustomer error:', error)
        return res.status(500).json({error: 'server error'})
    }

}


















