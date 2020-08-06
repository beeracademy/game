import { Card } from './card';

export class Game {
  constructor(
    public start_datetime: number = 0,
    public official: boolean = true,
    public player_names: string[] = [],
    public seed: number[] = [],
    public cards: Card[] = [],

    public has_ended = false,
    public description?,
    public dnf = false,

    public dnf_player_ids: number[] = [],

    // Not needed for offline
    public id?: number,
    public player_ids?: number[],
    public token?: string,
  ) {}
}
