import axios from "axios";
import type { Customer } from '../types/customer.type';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('app_token');
  return { headers: { Authorization: `Bearer ${token}` } };
};


// ─────────────────────────────────────────
// CUSTOMERS CRUD FETCH
// ─────────────────────────────────────────
export const getAllCustomers = async (): Promise<Customer[]> =>{
    const res = await axios.get(`${API_URL}/customers`, getAuthHeaders())
    return res.data
}

export const getCustomerById = async (id: string | number): Promise<Customer> =>{
    const res = await axios.get(`${API_URL}/customers/${id}`, getAuthHeaders())
    return res.data
}

export const createCustomer = async (data: Partial<Customer> ): Promise<Customer> =>{
    const res = await axios.post(`${API_URL}/customers`, data,  getAuthHeaders())
    return res.data
}

export const updateCustomer = async (id: string | number, data: Partial<Customer>): Promise<Customer> =>{
    const res = await axios.patch(`${API_URL}/customers/${id}`, data, getAuthHeaders())
    return res.data
}

export const deleteCustomer = async (id: string | number): Promise<{message: string}> =>{
    const res = await axios.delete(`${API_URL}/customers/${id}`, getAuthHeaders())
    return res.data
}