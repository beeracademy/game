export class Card {
  constructor(
    public value: number,
    public suit: string,
    public drawn_datetime?: string,
    public chug_duration_ms?: number
  ) {}
}

export const suits = ['S', 'C', 'H', 'D', 'A', 'I'];
export const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
