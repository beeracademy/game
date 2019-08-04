import { Card } from './card';

export class Game {
  constructor(
    public start_datetime: number = 0,
    public end_datetime: number = 0,
    public description: string = '',
    public official: boolean = true,
    public player_names: string[] = [],
    public seed: number[] = [],
    public draws: Card[] = [],

    // Not needed for offline
    public id?: number,
    public player_ids?: number[]
  ) {}
}
