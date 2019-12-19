import { Request, Response, NextFunction } from 'express';
import { Character, getCharacterListForMovie } from 'services/swapiService';
import arraySort = require('array-sort');

function characterResponseFn(characters: Character[]) {
  return characters.map(character => {
    const {
      name,
      gender,
      height_in_cm,
      height_in_feet_inches,
      mass,
      created,
      edited,
    } = character;

    return {
      name,
      gender,
      height_in_cm,
      height_in_feet_inches,
      mass,
      created,
      edited,
    }
  })
}

function filterFn<T>(key: keyof T, value: any) {
  return (list: T[]): T[] => {
    if (typeof value === 'undefined') return list;

    return list.filter(object => {
      return object[key] === value
    })
  }
}

function sortFn<T>(sortProperty: string | undefined) {
  return (list: T[]): T[] => {
    if (typeof sortProperty === 'undefined') return list;

    const isReverse = sortProperty[0] === '-';
    sortProperty = sortProperty[0] === '-' ? sortProperty.substr(1) : sortProperty;

    // @ts-ignore
    return arraySort(list, sortProperty, { reverse: isReverse })
  }
}

export async function charactersHandler(req: Request, res: Response, next: NextFunction) {
  try {
    let sortProperty = req.query.sort;

    if (Array.isArray(sortProperty)) {
      sortProperty = sortProperty[0]
    }

    const characterList = await getCharacterListForMovie(req, req.movie!);
    const characterFormattedList = characterResponseFn(characterList);
    const filteredCharacterList = filterFn('gender', req.query.gender)(characterFormattedList);
    const sortedCharacterList = sortFn(sortProperty)(filteredCharacterList);

    res.send({
      results: sortedCharacterList,
      total: sortedCharacterList.length,
    });
  } catch (e) {
    next(e);
  }
}
