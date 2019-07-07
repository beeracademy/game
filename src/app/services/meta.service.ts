import { Injectable } from '@angular/core';
import { UsersService } from './users.service';
import { Card } from '../models/card';
import { GameService } from './game.service';

@Injectable({
  providedIn: 'root'
})
export class MetaService {

  constructor(private usersService: UsersService, private gameService: GameService) {}

  public getTheoraticalMax(cards: Card[]): number {
    return 0;
  }

  public getTheoraticalMin(cards: Card[]): number {
    return 0;
  }

  public getBeers(cards: Card[]): number {
    return Math.floor(this.getSips(cards) / 14);
  }

  public getSips(cards: Card[]): number {
    let res = 0;

    for (const c of cards) {
      res += c.value;
    }

    return res;
  }

  public getCummulativeSips(cards: Card[]) {
    const res = [];
    cards.reduce((a, b, i) => res[i] = a + b.value, 0);
    return [0].concat(res);
  }

  public getUserCards(userIndex): Card[] {
    return this.gameService.game.cardsDrawn.filter((_, i) => i % this.gameService.game.playerCount === userIndex);
  }
}
