import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { PokeResponse } from './interfaces/poke-response.interface';


@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel : Model<Pokemon>,

    private readonly http: AxiosAdapter
  ){

  }
 
  async excecuteSeed() {

    await this.pokemonModel.deleteMany({}); // Delete * from pokemon

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    const pokemonToInsert: {name: string , no: number} []  = [];
    
    data.results.forEach( async({name,url}) => {
        const segments = url.split('/');
        const no =  +segments[segments.length - 2];

       //const pokemon = await this.pokemonModel.create({name, no});

       pokemonToInsert.push({name, no})
    });

    this.pokemonModel.insertMany(pokemonToInsert);


    return 'Seed Executed';
  }
}
