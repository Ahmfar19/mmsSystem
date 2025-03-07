/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { invoke } from '@tauri-apps/api/tauri';
import Database from 'tauri-plugin-sql-api';
import { ApiResponse } from './types';

const db = await Database.load('sqlite:data.sqlite');

export async function postData(values: any, tableName: string): Promise<ApiResponse> {
    function generateInsertSQL(table: string, sqlValues: any): string {
        const columns = Object.keys(sqlValues).join(', ');
        const columnValues = Object.values(sqlValues).map(val => typeof val === 'string' ? `'${val}'` : val).join(', ');

        return `INSERT INTO ${table} (${columns}) VALUES (${columnValues})`;
    }

    try {
        const insertSQL = generateInsertSQL(tableName, values);
        const result = await db.execute(insertSQL);
        return { id: result.lastInsertId };
    } catch (error) {
        console.error('Error:', error);
        return { error: true };
    }
}

export async function getData(
    table: string,
    where?: string,
): Promise<any> {
    try {
        let getSQL = `SELECT * FROM ${table}`;
        if (where) {
            getSQL = `SELECT * FROM ${table} WHERE ${where}`;
        }
        const result = await db.select(getSQL);
        return result;
    } catch (error) {
        console.error('Error:', error);
        return error;
    }
}

export const updateData = async (id: number, patchData: any, table: string, id_name: string): Promise<ApiResponse> => {
    function generateUpdateSQL(tableName: string, values: any, condition: string): string {
        const setClause = Object.entries(values)
            .map(([key, value]) => typeof value === 'string' ? `${key} = '${value}'` : `${key} = ${value}`)
            .join(', ');

        return `UPDATE ${tableName} SET ${setClause} WHERE ${condition}`;
    }

    try {
        const updateSQL = generateUpdateSQL(table, patchData, `${id_name}=${id}`);
        const result = await db.execute(updateSQL);
        return {};
    } catch (error) {
        console.error('Error:', error);
        return { error: true };
    }
};

export const deleteData = async (id: number, table: String, id_name: string): Promise<ApiResponse> => {
    try {
        const result = await db.select(`DELETE FROM ${table} WHERE ${id_name}=${id}`);
        return {};
    } catch (error) {
        console.error('Error:', error);
        return { error: true };
    }
};

export async function getJoinData(
    fTable: string,
    jTable: string,
    fIDname: string,
    jIDname: string,
    where: string,
): Promise<any> {
    try {
        const getJoinSQL = `SELECT *
        FROM ${fTable}
        JOIN ${jTable} ON ${fIDname} = ${jIDname}
        WHERE ${where}`;

        const result = await db.select(getJoinSQL);
        return result;
    } catch (error) {
        console.error('Error:', error);
        return error;
    }
}
