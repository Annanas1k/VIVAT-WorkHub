
export type CustomerType = 'individual' | 'company'

export interface CustomerProject {
    id: number;
    name: string;
    status: string;
}


export interface Customer {
    id: number;
    type: CustomerType;
    name: string;
    email: string | null;
    address: string | null;
    phone: string |null;
    notes: string | null;

    company: string | null;
    vatNumber: string | null;
    regNumber:  string |null;

    firstName: string | null;
    lastName: string | null;

    createdAt: string | null;
    projects: CustomerProject[];
}


