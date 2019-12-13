import { Request, Response, NextFunction } from 'express';
import { getCharacterList, Character } from 'services/swapiService';
import arraySort = require('array-sort');

function characterResponseFn(characters: Character[]) {
  return characters.map(character => {
    const {
      name,
      gender,
      height_in_cm,
      height_in_feet,
      mass,
      created,
      edited,
    } = character;

    return {
      name,
      gender,
      height_in_cm,
      height_in_feet,
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

    return arraySort(list, sortProperty, { reverse: isReverse })
  }
}

export function charactersHandler(req: Request, res: Response, next: NextFunction) {
  let sortProperty = req.query.sort;
  if (Array.isArray(sortProperty)) {
    sortProperty = sortProperty[0]
  }

  getCharacterList(req)
    .then(characterResponseFn)
    .then(filterFn('gender', req.query.gender))
    .then(sortFn(sortProperty))
    .then(response => {
      res.send({
        results: response,
        total: response.length,
      });
    })
    .catch(e => next(e))
}
