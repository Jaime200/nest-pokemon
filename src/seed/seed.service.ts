
import { Injectable } from '@nestjs/common';
import axios, {AxiosInstance} from 'axios'
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from '../pokemon/pokemon.service';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
@Injectable()
export class SeedService {
  
  private readonly axiosInstance: AxiosInstance = axios ;
  private readonly axiosUrl : string =`https://pokeapi.co/api/v2/pokemon?limit=10`
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel : Model<Pokemon>
  ){

  }
  async executeSeed(){
   await  this.pokemonModel.deleteMany();
    const { data } = await axios.get<PokeResponse>(this.axiosUrl);
    const pokemonToInsert :{name:string , no:number}[]= [];
    data.results.forEach( ({name,url})=>{
      const segments = url.split('/')
      const no = +segments[segments.length -2];
      console.log(name, no)
      pokemonToInsert.push({name, no})
    })

    await this.pokemonModel.insertMany(pokemonToInsert);
    return 'Seed executed'
  }
}
