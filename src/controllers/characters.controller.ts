import { Request, Response, NextFunction } from 'express';
import { Character, getCharacterListForMovie } from 'services/swapiService';
import arraySort = require('array-sort');
import { convertFromCMToFeetAndInches } from '../utils';

interface ResponseCharacter {
  name: string;
  gender: string;
  height: number | null;
  mass: string;
  created: string;
  edited: string;
}

function characterResponseFn(characters: Character[]): ResponseCharacter[] {
  return characters.map(character => {
    const {
      name,
      gender,
      height,
      mass,
      created,
      edited,
    } = character;

    return {
      name,
      gender,
      height,
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
    const filteredCharacterList = filterFn<ResponseCharacter>('gender', req.query.gender)(characterFormattedList);
    const sortedCharacterList = sortFn<ResponseCharacter>(sortProperty)(filteredCharacterList);

    const totalHeightInCM = sortedCharacterList.reduce((total, character) => total + (character.height || 0), 0);

    res.send({
      results: sortedCharacterList,
      total: sortedCharacterList.length,
      total_height_in_cm: totalHeightInCM,
      total_height_in_ft_inches: convertFromCMToFeetAndInches(totalHeightInCM),
    });
  } catch (e) {
    next(e);
  }
}
