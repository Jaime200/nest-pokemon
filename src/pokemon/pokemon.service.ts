import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, isValidObjectId, Model } from 'mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel : Model<Pokemon>,
    private readonly configService: ConfigService
  ){
    
  }


  async create(createPokemonDto: CreatePokemonDto) {
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto)
      return pokemon;  
    } catch (error) {
      this.handleExpections(error)
    }
    
    
  }

  findAll(queryParameter : PaginationDto ) {
    //this.configService.getOrThrow('defaultLimit'), 
    const { limit = 7, 
            offset= 0 } = queryParameter
            console.log('Hola')
    return this.pokemonModel.find()
    .limit(limit)
    .skip(offset)
    .sort({
      no:1
    })
    .select('-__v')
  }

  async findOne(term: string) {


    let pokemon : Pokemon;
    let filter: FilterQuery<Pokemon> = { };
    if(!isNaN(+term))
    filter.no = +term    
    else if(isValidObjectId(term))
    filter._id = term
    else
    filter.name = term
    pokemon = await this.pokemonModel.findOne(filter)
    if(!pokemon) throw new  NotFoundException(`pokemon ${term} not found `);
    return pokemon;
  }

 async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    try {
  
      const pokemon = await this.findOne(id);
      await pokemon.updateOne(updatePokemonDto, {new:true})
     return {...pokemon.toJSON(), ...updatePokemonDto};

    } catch (error) {
      this.handleExpections(error)
    }
  }


 async remove(id: string) {
    try {
  
      const pokemon = await this.findOne(id);
      await pokemon.deleteOne()

    } catch (error) {
      this.handleExpections(error)
    }
  }

  async removeByMongoId(id: string) {
   
  
     // const result = await this.pokemonModel.findByIdAndDelete(id);
      const { acknowledged, deletedCount } = await this.pokemonModel.deleteOne({_id: id});
      if( deletedCount === 0 )
      throw new BadRequestException(`Pokemon with id "${id}" not found`)

      return {
        deletedCount,
        acknowledged
      }

  }

  private handleExpections(error: any){
    console.error(error)
    if(error.code ===11000) throw new BadRequestException(`Pokemont exists in db ${JSON.stringify(error.keyValue)}`)

    throw new InternalServerErrorException(`Can't update Pokemon - Check server logs`)
  }
}
