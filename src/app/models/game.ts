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

    // Not needed for offline
    public id?: number,
    public player_ids?: number[]
  ) {}
}

export function getStartDeltaMs(game: Game): number {
  return Date.now() - (new Date(game.start_datetime)).getTime();
}

export function getDuration(game: Game): number {
  if (game.has_ended) {
    const c = game.cards[game.cards.length - 1];
    if (c.chug_end_start_delta_ms) {
      return c.chug_end_start_delta_ms;
    } else {
      return c.start_delta_ms;
    }
  } else {
    return getDuration(game);
  }
}
