
import { HttpAdapter } from '../Interfaces/http-adapter.interface'
import axios, {AxiosInstance} from 'axios'
import { Injectable } from '@nestjs/common';

@Injectable()
export class AxiosAdapter implements HttpAdapter {
    private  axiosInstance: AxiosInstance = axios ;

    async get<T>(url: string): Promise<T> {
        try {
         const { data } = await this.axiosInstance.get<T>(url);    
         return data;
        } catch (error) {
            throw new Error('This is an error - Check logs')
        }
        
    }    
}