export class Card {
  constructor(
    public value: number,
    public suit: string,
    public start_delta_ms?: number,
    public chug_start_start_delta_ms?: number,
    public chug_end_start_delta_ms?: number,
 ) {}
}

export const suits = ['S', 'C', 'H', 'D', 'A', 'I'];
export const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

export function getChugDuration(card: Card): number {
  return card.chug_end_start_delta_ms - card.chug_start_start_delta_ms;
}
