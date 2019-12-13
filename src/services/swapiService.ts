import * as axiosClient from 'axios';
import { Request } from 'express';

const swapiClient = axiosClient.default.create({
  baseURL: 'https://swapi.co/api/',
  timeout: 10000,
});

export interface Movie {
  characters: string[],
  created: string,
  director: string,
  opening_crawl: string,
  producer: string,
  release_date: string,
  title: string,
  episode_id: number,
  url: string,
}

export interface MoviesData {
  count: number,
  next: string,
  previous: string,
  results: Movie[],
}

export interface Character {
  name: string,
  gender: string,
  height: string,
  height_in_cm?: number,
  height_in_feet?: number,
  mass: string,
  hair_color: string,
  created: string,
  edited: string,
}

export interface CharacterListData {
  count: number,
  next: string,
  previous: string,
  results: Character[]
}

function parseCharactersList(list: Character[]): Character[] {
  return list.map(character => {
    character.height_in_cm = Number(character.height);
    character.height_in_feet = Math.round(character.height_in_cm * 100 / 30.48) / 100;

    return character;
  })
}

export function getMovies(req: Request) {
  req.logger.debug('fetching movies list');
  return swapiClient.get<MoviesData>('/films').then(response => {
    req.logger.debug('movies response came');
    return response.data;
  });
}

export function getMovie(req: Request, id: string) {
  req.logger.debug(`fetching movie with id: ${id}`);

  return swapiClient.get<Movie>(`/films/${id}`).then(response => {
    req.logger.debug(`received movie response with id: ${id}`);
    return response.data;
  })
}

export async function getCharacterList(req: Request) {
  req.logger.debug(`fetching characters`);
  let results: Character[] = [];

  let response = await swapiClient.get<CharacterListData>('/people')
  results = results.concat(response.data.results);

  while (response.data.next) {
    response = await swapiClient.get<CharacterListData>(response.data.next);
    results = results.concat(response.data.results);
  }

  req.logger.debug(`received characters`);

  return parseCharactersList(results);
}
