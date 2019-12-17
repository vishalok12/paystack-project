import * as axiosClient from 'axios';
import { Request } from 'express';
import { getRedisClient } from './redisService';

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

async function swapiClientGet<T>(req: Request, url: string) {
  const redisClient = await getRedisClient();
  try {
    const value = await redisClient.get(req, url);

    if (value !== null) {
      req.logger.debug(`Return Response from Cache for API: ${url}`);
      return JSON.parse(value);
    }

    req.logger.debug(`Not available in cache: ${url}. Hitting API`);
    const result = await swapiClient.get<T>(url);

    req.logger.debug(`Got response for API: ${url}`);
    redisClient.save(req, url, JSON.stringify(result.data));

    return result.data;
  } catch (e) {
    throw e;

  }
}

function parseCharactersList(list: Character[]): Character[] {
  return list.map(character => {
    character.height_in_cm = Number(character.height);
    character.height_in_feet = Math.round(character.height_in_cm * 100 / 30.48) / 100;

    return character;
  })
}

export async function getMovies(req: Request) {
  req.logger.debug('fetching movies list');
  let results: Movie[] = [];

  let data = await swapiClientGet<MoviesData>(req, '/films');
  results = results.concat(data.results);

  while (data.next) {
    data = await swapiClientGet<MoviesData>(req, data.next);
    results = results.concat(data.results);
  }

  req.logger.debug('movies response came');

  return results;
}

export async function getMovie(req: Request, id: string) {
  try {
    req.logger.debug(`fetching movie with id: ${id}`);

    const data = await swapiClientGet<Movie>(req, `/films/${id}`);
    req.logger.debug(`received movie response with id: ${id}`);
    return data;
  } catch (e) {
    req.logger.error(`Error while fetching movie with id: ${id}`)
    throw e;
  }
}

export async function getCharacterListForMovieId(req: Request, movieId: string) {
  let results: Character[] = [];

  const movie = await getMovie(req, movieId);

  req.logger.debug(`fetching characters`);

  const charactersPromise = movie.characters.map((characterAPIPath: string) => {
    return swapiClientGet<Character>(req, characterAPIPath)
  });

  results = await Promise.all(charactersPromise);

  req.logger.debug(`received characters`);

  return parseCharactersList(results);
}
