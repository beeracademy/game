export class User {
  constructor(
    public username: string,
    public id: number,
    public token: string = '',
    public image: string = '',
    public color: string = '',
    public index: number = 0
  ) {}
}
