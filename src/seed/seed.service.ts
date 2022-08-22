
import { Injectable } from '@nestjs/common';
import axios, {AxiosInstance} from 'axios'
import { PokeResponse } from './interfaces/poke-response.interface';
@Injectable()
export class SeedService {

  private readonly axiosInstance: AxiosInstance = axios ;
  private readonly axiosUrl : string =`https://pokeapi.co/api/v2/pokemon?limit=10`
  async executeSeed(){
    const { data } = await axios.get<PokeResponse>(this.axiosUrl);
  
    data.results.forEach(({name, url})=>{
      const segments = url.split('/')
      const no = +segments[segments.length -2];
      console.log({name, no})
    })
    return data
  }
}
