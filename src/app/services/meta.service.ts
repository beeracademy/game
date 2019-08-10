import { Injectable } from '@angular/core';
import { Card } from '../models/card';
import { GameService } from './game.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class MetaService {

  constructor(private gameService: GameService) {}

  private getTheoratical(user: User, sort: (a: number, b: number) => number) {
      let remaining = this.gameService.getCardsLeft().map(c => c.value).sort(sort);

      remaining = remaining.slice(remaining.length - this.gameService.getDrawsLeftForPlayer(user), remaining.length);
      remaining.push(...this.gameService.getCardsForPlayer(user).map(c => c.value));

      return remaining.reduce((a, b) => a + b, 0);
  }

  public getTheoraticalMax(user: User): number {
      return this.getTheoratical(user, (a, b) => b - a);
  }

  public getTheoraticalMin(user: User): number {
    return this.getTheoratical(user, (a, b) => a - b);

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

  public getSipsLeftInBeer(cards: Card[]) {
    return 14 - (this.getSips(cards) % 14);
  }

  public getPercentageLeftInBeer(cards: Card[]) {
    return (this.getSipsLeftInBeer(cards) / 14) * 100;
  }

  public getLeadingPlayer() {
    const numPlayers = this.gameService.getNumberOfPlayers();
    const cards = this.gameService.game.cards;

    const playerSums = new Array(numPlayers).fill(0);

    for(let i = 0; i < cards.length; i++) {
      const playerIndex = i % numPlayers;
      playerSums[playerIndex] += cards[i].value;
    }

    return playerSums.indexOf(Math.max(...playerSums));
  }
}
