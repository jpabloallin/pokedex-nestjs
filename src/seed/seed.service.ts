import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/http-adapters/axios.adapter';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokemonResponse } from './interfaces/pokemon.response.interface';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany(); //Delete all pokemon before 
    
    const data = await this.http.get<PokemonResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    const pokemonToInsert: { name: string, no: number }[] = [];

    data.results.forEach(async({ name, url }) => {

      const segments = url.split('/')
      const no = +segments[ segments.length - 2 ];

      pokemonToInsert.push({ name, no }); // [{ name: bulbasaur, no:1  }]
      //const pokemon = await this.pokemonModel.create({ name, no });
    });
    await this.pokemonModel.insertMany(pokemonToInsert);
    
    return 'Seed executed';
  }
}
