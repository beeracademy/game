import { Injectable } from "@angular/core";
import { GameService } from "./game.service";
import { environment } from "../../environments/environment";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  socket: WebSocket;

  public onConnectionChange = new BehaviorSubject<boolean>(false);
  public onMessage = new Subject<any>();

  constructor(private gameService: GameService) {
    this.startSocket();
  }

  public startSocket() {
    const url = environment.url.replace(/^http/, "ws");
    const gameId = this.gameService.game.id;
    this.socket = new WebSocket(`${url}/ws/chat/${gameId}/?game`);

    this.socket.addEventListener("open", (e) => {
      this.onConnectionChange.next(true);
    });
    this.socket.addEventListener("close", (e) => {
      this.onConnectionChange.next(false);
      console.error("Chat socket closed unexpectedly");
      setTimeout(this.startSocket.bind(this), 1000);
    });
    this.socket.addEventListener("error", (e) => {
      console.error("Got an error from chat socket!");
      this.socket.close();
    });
    this.socket.addEventListener("message", (e) => {
      const data = JSON.parse(e.data);
      this.onMessage.next(data);
    });
  }

  public sendMessage(message: string) {
    this.socket.send(
      JSON.stringify({
        message: message,
      })
    );
  }
}
