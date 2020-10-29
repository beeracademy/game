export class User {
  constructor(
    public id?: number,
    public username: string = "",
    public token: string = "",
    public image: string = "",
    public color: string = "",
    public index: number = 0
  ) {}
}
