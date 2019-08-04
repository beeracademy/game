export class Card {
  constructor(
    public value: number,
    public suit: string,
    public drawn_datetime?: number,
    public chug_duration?: number
  ) {}

  get image(): string {
    return 'assets/' + this.suit[0] + '-' + this.value;
  }
}

export const suits = ['S', 'C', 'H', 'D', 'A', 'I'];
export const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
