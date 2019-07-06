import { Card } from './card';
import { Chug } from './chug';

export class Game {
  constructor(
    public id: number = 0,
    public startTime: number = 0,
    public endTime: number = 0,
    public playerCount: number = 2,
    public cardsDrawn: Card[] = [],
    public chugs: Chug[] = [],
  ) {}
}
