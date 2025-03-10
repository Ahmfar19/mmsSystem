import { Accessor, Setter } from 'solid-js';
import { SetStoreFunction } from 'solid-js/store';

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
    mark_id: string;
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

interface StaffType {
    staff_id?: number;
    username: string;
    fname: string;
    lname: string;
    phone: number;
    email: string;
    role: number;
    password: string;
    image: File | string;
    userImage: string | undefined;
}

interface PasswordFormType {
    password: string;
    new_password: string;
    verify_password: string;
}

type AppContextState = {
    theme: string;
    locale: string;
    sidebarPosition: string;
    sidebarLayout: string;
    accessToken?: string;
    staff: StaffType;
    fingerprint: string;
    isAdmin: boolean;
    isInlogged: boolean;
    onAuthenticate: boolean;
};

type AppContextValue = {
    store: AppContextState;
    changeTheme: (theme: string) => void;
    changeSideBarPosition: (position: string) => void;
    changeSideBarLayout: (layout: string) => void;
    setState: (key: keyof AppContextState, value: any) => void;
    setStore: SetStoreFunction<AppContextState>;
    clearAllCookies: () => void;
};

interface DialogViewComponent {
    changes: Accessor<any>;
    setChanges: Setter<any>;
    validate?: Accessor<boolean>;
    setValidate?: Setter<boolean>;
    values?: any;
    t: Function;
    state: AppContextState;
    options?: any;
}

export {
    type AgentType,
    type ApiResponse,
    type AppContextState,
    type AppContextValue,
    type CustomerType,
    type MarkTtype,
    type PasswordFormType,
    type StaffType,
    type DialogViewComponent
};
