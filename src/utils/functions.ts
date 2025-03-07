import bcrypt from 'bcryptjs';
import { createSignal } from 'solid-js';
import { postData } from './api';
import showToast from './ToastMessage';
import { NotesData, PaymentsData } from './types';

export const [isInlogged, setIsInloged] = createSignal<boolean>(!!localStorage.getItem('inlogged'));

export async function createNote(
    mark_id: number,
    note_title: string,
    note_date: string,
    note_text?: string,
    toast?: boolean,
): Promise<any> {
    const notesData = {
        staff_id: 1,
        mark_id,
        note_title,
        note_date,
        note_text,
    } as NotesData;

    const { error, id } = await postData(notesData, 'note');

    if (error) {
        showToast({
            message: 'فشل اضافة الملاحظة',
            type: 'error',
        });
    } else {
        notesData.note_id = id;
        return notesData;
    }

    if (toast) {
        showToast({ message: 'تم اضافة الملاحظة', type: 'success' });
    }
    return false;
}

export async function createPayment(
    mark_id: string,
    amount: string | number,
    receipt_number: string,
    payment_date: string,
    payment_note: string,
    toast?: boolean,
): Promise<any> {
    const paymentsData = {
        staff_id: 1,
        mark_id,
        amount,
        receipt_number,
        payment_date,
        payment_note,
    } as PaymentsData;

    const { error, id } = await postData(paymentsData, 'payment');

    if (error) {
        showToast({
            message: 'فشل اضافة الدفعة',
            type: 'error',
        });
    } else {
        paymentsData.payment_id = id;
        return paymentsData;
    }

    if (toast) {
        showToast({ message: 'تم اضافة الدفعة', type: 'success' });
    }
    return false;
}

export function getDate(format?: string): string {
    const currentDate = new Date();
    if (format === 'year') {
        return String(currentDate.getFullYear());
    }
    return currentDate.toISOString().split('T')[0];
}

export function calculateDateAfter10Years(inputDate: string): string {
    const inputDateObject = new Date(inputDate);

    if (!Number.isNaN(inputDateObject.getTime())) {
        // Lägg till 10 år till det givna datumet
        inputDateObject.setFullYear(inputDateObject.getFullYear() + 10);

        // Hämta rätt månad (1-indexerad) och dag från det nya datumet
        const month = inputDateObject.getMonth() + 1;
        const day = inputDateObject.getDate();

        // Formatera det nya datumet som 'ÅÅÅÅ-MM-DD'
        const year = inputDateObject.getFullYear();
        const formattedMonth = month < 10 ? `0${month}` : month.toString();
        const formattedDay = day < 10 ? `0${day}` : day.toString();
        return `${year}-${formattedMonth}-${formattedDay}`;
    }
    return '';
}

export function isDateInPast(inputDate: string) {
    const inputDateObject = new Date(inputDate);
    const currentDate = new Date();

    if (inputDateObject < currentDate) {
        return true;
    }
    return false;
}

export function isDateInFeature(inputDate: string) {
    const inputDateObject = new Date(inputDate);
    const currentDate = new Date();

    if (inputDateObject > currentDate) {
        return true;
    }
    return false;
}

export function isCurrentMonthAndYear(date: string) {
    const currentDate = new Date();
    const inputDate = new Date(date);

    const inputMonth = inputDate.getMonth() + 1; // months are 0-indexed, so add 1
    const inputYear = inputDate.getFullYear();

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    if (inputYear === currentYear && inputMonth === currentMonth) {
        return true;
    }
    return false;
}

export function getYearFromDate(date: string) {
    const inputDate = new Date(date);
    const year = inputDate.getFullYear();
    return year;
}

export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export function calculatePercentage(partial: number, total: number) {
    const percentage = (partial / total) * 100;
    return percentage ? percentage.toFixed(2) : 0;
}

// Function to hash a password
export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Number of salt rounds (the higher, the more secure but slower)
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

// Function to compare a password with its hash
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}
