import { ApiResponse } from './types';

export async function postData(values: any, type: string, tableName?: string, files?: File[]): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('type', type);
    formData.append('requestData', JSON.stringify(values)); // Additional data if needed
    if (tableName) {
        formData.append('table', tableName);
    }

    if (files) {
        files.forEach((file: File) => {
            formData.append('file[]', file);
        });
    }

    try {
        const response = await fetch('http://localhost:8080/ipaz-server/api.php', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (data.error) {
            return { error: true };
        }
        if (data.id) {
            return data;
        }
        return {};
    } catch (error) {
        console.error('Error:', error);
        return { error: true };
    }
}

export async function getData(
    type: string,
    table: string,
    customFilter?: string,
): Promise<any> {
    let url = `http://localhost:8080/ipaz-server/api.php?type=${type}&table=${table}`;
    if (customFilter) {
        url = `http://localhost:8080/ipaz-server/api.php?type=${type}&table=${table}&custum_filter=${customFilter}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            console.error(data);
            // throw new Error("Network response was not ok");
            return data;
        }
        return data;
    } catch (error) {
        console.error('Error:', error);
        // throw new Error("Network response was not ok");
        return error;
    }
}

export const updateData = async (type: string, id: number, patchData: any, table: String): Promise<ApiResponse> => {
    try {
        const response = await fetch(`http://localhost:8080/ipaz-server/api.php?id=${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                type,
                id,
                requestData: patchData,
                table,
            }),
        });

        const data = await response.json();

        if (data.error) {
            return { error: true };
        }
        return {};
    } catch (error) {
        // Network or other errors
        console.error('Error:', error);
        return { error: true };
    }
};

export const deleteData = async (type: string, id: number, table: String): Promise<ApiResponse> => {
    try {
        const response = await fetch(`http://localhost:8080/ipaz-server/api.php?type=${type}&table=${table}&id=${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (data.error) {
            return { error: true };
        }
        return {};
    } catch (error) {
        // Network or other errors
        console.error('Error:', error);
        return { error: true };
    }
};

export async function getCustomData(
    type: string,
    key?: string,
    value?: string,
): Promise<any> {
    if (key === '' || value === '') {
        return [];
    }

    const url = `http://localhost:8080/ipaz-server/api.php?type=${type}&key=${key}&value=${value}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            console.error(data);
            // throw new Error("Network response was not ok");
            return data;
        }
        return data;
    } catch (error) {
        console.error('Error:', error);
        // throw new Error("Network response was not ok");
        return error;
    }
}
