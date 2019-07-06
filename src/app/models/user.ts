export class User {
  constructor(
    public username: string,
    public token: string = '',
    public color: string = '',
    public index: number = 0
  ) {}
}
