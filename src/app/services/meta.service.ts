import { Injectable } from '@angular/core';
import { UsersService } from './users.service';
import { Card } from '../models/card';
import { GameService } from './game.service';

@Injectable({
  providedIn: 'root'
})
export class MetaService {

  constructor(private gameService: GameService) {}

  public getTheoraticalMax(index: number): number {
    return 0;
  }

  public getTheoraticalMin(index: number): number {
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

  public getSipsLeftInBeer(cards: Card[]) {
    return 14 - (this.getSips(cards) % 14);
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
