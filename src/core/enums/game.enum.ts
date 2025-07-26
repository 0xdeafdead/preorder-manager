import { registerEnumType } from '@nestjs/graphql';

export enum Game {
  ONEPIECE = 'ONEPIECE',
  DIGIMON = 'DIGIMON',
  GUNDAM = 'GUNDAM',
  MTG = 'MTG',
  POKEMON = 'POKEMON',
  OTROS = 'OTROS',
}

registerEnumType(Game, {
  name: 'Game',
});
