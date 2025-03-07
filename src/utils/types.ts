export interface PaymentsData {
    staff_id?: number;
    mark_id: string;
    amount: string | number;
    receipt_number: string;
    payment_date: string;
    payment_note: string;
    payment_id?: number;
}

export interface NotesData {
    staff_id?: number;
    mark_id: number;
    note_title: string;
    note_date: string;
    note_text?: string;
    toast?: boolean;
    note_id?: number;
}

interface MarkTtype {
    mark_id: number;
    category_id: number;
    customer_id: number;
    language_id: number;
    staff_id: number;
    name_ar: string;
    name_en: string;
    description: number;
    drawing: string;
    materials: string;
    logo: File[];
    [key: string]: any; // Add an index signature
}

interface CustomerType {
    customer_id: number;
    firstname: string;
    lastname: string;
    fathername: string;
    mothername: string;
    personnumber: string;
    nationality: string;
    adress: string;
    phonenumber: string;
    mail: string;
    [key: string]: any; // Add an index signature
}

interface AgentType {
    agent_id: number;
    agent: string;
    agent_register: string;
    agent_Adress: string;
    [key: string]: any; // Add an index signature
}

interface ApiResponse {
    error?: boolean;
    id?: number;
    role?: string;
}

export { type AgentType, type ApiResponse, type CustomerType, type MarkTtype };
