import { registerEnumType } from '@nestjs/graphql';

export enum Game {
  ONEPIECE = 'ONEPIECE',
  DIGIMON = 'DIGIMON',
  MTG = 'MTG',
  POKEMON = 'POKEMON',
}

registerEnumType(Game, {
  name: 'Game',
});
