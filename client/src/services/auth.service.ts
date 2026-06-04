import axios from "axios";
import type { UserData } from "../types/auth.types";

const API_URL = import.meta.env.VITE_API_URL 

interface AuthResponce {
    token: string
    user: UserData
    message: string
}

export const loginService = async (email: string, password: string): Promise<AuthResponce> =>{
    const res = await axios.post(`${API_URL}/auth/login`, {email, password})
    return res.data;
}

export const registerService = async (name: string, email: string, password: string): Promise<AuthResponce> =>{
    const res = await axios.post(`${API_URL}/auth/register`, {name, email, password})
    return res.data
}

export const googleLoginService = async (idToken: string): Promise<AuthResponce> =>{
    const res = await axios.post(`${API_URL}/auth/google`, {idToken})
    return res.data
}

