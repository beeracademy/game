export class Card {
  constructor(
    public id: number,
    public value: number,
    public suit: string
  ) {}

  get image(): string {
    return 'assets/' + this.suit + '-' + this.value;
  }
}
