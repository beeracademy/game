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

  public toBase14(n: number): string {
      return n.toString(14).toUpperCase();
  }

  public getTheoraticalMax(user: User): string {
      return this.toBase14(this.getTheoratical(user, (a, b) => b - a));
  }

  public getTheoraticalMin(user: User): string {
    return this.toBase14(this.getTheoratical(user, (a, b) => a - b));

  }

  public getBeers(cards: Card[]): number {
    return Math.floor(this.getSips(cards) / 14);
  }

  public getBeersArray(cards: Card[]): number[] {
    return new Array(this.getBeers(cards));
  }

  public getSips(cards: Card[]): number {
    let res = 0;

    for (const c of cards) {
      res += c.value;
    }

    return res;
  }

  public getTotalSips(cards: Card[]): string {
      return this.toBase14(this.getSips(cards));
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

  public isLeadingPlayer(i: number): boolean {
    const numPlayers = this.gameService.getNumberOfPlayers();
    const cards = this.gameService.game.cards;

    const playerSums = new Array(numPlayers).fill(0);

    const fullRoundCards = cards.length - cards.length % numPlayers;

    for (let j = 0; j < fullRoundCards; j++) {
      const playerIndex = j % numPlayers;
      playerSums[playerIndex] += cards[j].value;
    }

    const maxScore = Math.max(...playerSums);
    return maxScore > 0 && maxScore === playerSums[i];
  }

  public getTotalTime(user: User): number {
    const numPlayers = this.gameService.getNumberOfPlayers();
    const durations = this.gameService.getCardDurations();
    let time = 0;
    for (let j = user.index; j < durations.length; j += numPlayers) {
      time += durations[j];
    }
    return time;
  }
}
