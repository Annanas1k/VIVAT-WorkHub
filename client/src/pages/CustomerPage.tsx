import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import type { Customer } from "../types/customer.type"
import { BeatLoader } from "react-spinners"
import { getAllCustomers } from "../services/customer.service"
import { CustomerSidebarList } from "../components/customers/CustomerSidebarList"
import { CustomerDetailedView } from "../components/customers/CustomerDetailedView"

export const CustomerPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    
    const [customers, setCustomers] = useState<Customer[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    // Convertim id-ul din URL la number sau null dacă nu există
    const selectedId = id ? Number(id) : null

    useEffect(() => {
        const getCustomerData = async () => {
            try {
                setLoading(true)
                const data = await getAllCustomers()
                setCustomers(data)
            } catch (error) {
                console.error('Error fetching customers', error)
            } finally {
                setLoading(false)
            }
        }
        getCustomerData()
    }, [])

    const selectedCustomer = customers.find(c => c.id === selectedId) || null

    // Handler pentru schimbarea ID-ului în URL
    const handleSelectCustomer = (customerId: number) => {
        navigate(`/customers/${customerId}`)
    }

    // Handler pentru revenirea la listă (ștergerea ID-ului din URL)
    const handleBack = () => {
        navigate('/customers')
    }

    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <BeatLoader size={15} color="#4D179A" aria-label="Loading spinner" loading={loading} />
            </div>
        )
    }

    return (
        <section className="w-full min-h-screen flex flex-col md:flex-row font-mono text-sm text-gray-300">
            <div className={`w-full md:w-1/3 border-r border-gray-800 p-4 ${selectedId !== null ? 'hidden md:block' : 'block'}`}>
                <CustomerSidebarList 
                    customers={customers}
                    selectedId={selectedId}
                    onSelectCustomer={handleSelectCustomer}
                />
            </div>
            <div className={`w-full md:w-2/3 p-4 ${selectedId === null ? 'hidden md:block' : 'block'}`}>
                <CustomerDetailedView
                    customer={selectedCustomer}
                    onBack={handleBack}
                />
            </div>
        </section>
    )
}