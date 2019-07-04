import { Card } from './card';
import { Chug } from './chug';

export class Game {
  constructor(
    public startTime: number = 0,
    public endTime: number = 0,
    public playerCount: number = 4,
    public cardsDrawn: Card[] = [],
    public chugs: Chug[] = [],
  ) {}
}
