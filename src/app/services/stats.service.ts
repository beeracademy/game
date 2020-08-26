import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(private http: HttpClient) { }

  public GetUserStats(userId: number) {
    return this.http.get<UserStats[]>(`${environment.url}/api/stats/${userId}/`);
  }

  public GetRankedCards() {
    return this.http.get<{ [card_name: string]:RankedCard; }>(`${environment.url}/api/ranked_cards/`);
  }
}

export interface RankedCard {
  user_id: number;
  user_username: string;
  user_image: string;
  ranking_name: string;
  ranking_value: string;
}

export interface UserStats {
  season_number: number;
  total_games: number;
  total_time_played_seconds: number;
  total_sips: number;
  best_game: number;
  worst_game: number;
  best_game_sips: number;
  worst_game_sips: number;
  total_chugs: number;
  fastest_chug: number;
  fastest_chug_duration_ms: number;
  average_chug_time_seconds: number;
}
