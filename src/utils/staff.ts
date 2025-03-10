import { createResource } from 'solid-js';
import { getData } from './api';

export const [staffs, { refetch: refetchStaffs }] = createResource(async () => {
    const data = await getData('table', 'staff');
    // return data.filter((staff: any) => +staff.staff_id !== +(store.staff.staff_id || 0));
    return data;
});
