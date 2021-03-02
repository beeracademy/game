import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from "@angular/core";
import { environment } from "src/environments/environment";
import { ChatService } from "../../services/chat.service";
import { GameService } from "../../services/game.service";

class ChatMessage {
  username: string;
  userUrl: string;
  message: string;
  timestamp: Date;
}

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"],
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild("messagesContainer") messagesContainer: ElementRef;

  isDisconnected: boolean;
  messages: Array<any> = [];
  scrollToBottom = false;

  constructor(
    private gameService: GameService,
    private chatService: ChatService
  ) {
    const gameId = this.gameService.game.id;

    this.chatService.onConnectionChange.subscribe({
      next: (connected) => (this.isDisconnected = !connected),
    });
    this.chatService.onMessage.subscribe({
      next: (data) => {
        const message = new ChatMessage();
        message.username = data.is_game ? "Game" : data.username || "Guest";
        message.timestamp = new Date(data.datetime);

        switch (data.event) {
          case "message":
            message.username += ":";
            message.message = data["message"];
            break;
          case "connect":
            message.message = "connected";
            break;
          case "disconnect":
            message.message = "disconnected";
            break;
          default:
            console.error("Unknown message received:");
            console.error(data);
            break;
        }

        if (data.user_id) {
          message.userUrl = `${environment.url}/players/${data.user_id}/`;
        } else if (data.is_game) {
          message.userUrl = `${environment.url}/games/${gameId}/`;
        } else {
          message.userUrl = "#";
        }

        this.messages.push(message);

        this.scrollToBottom = true;
      },
    });
  }

  ngOnInit(): void {}

  ngAfterViewChecked(): void {
    if (this.scrollToBottom) {
      console.error("Scrolling!");
      this.messagesContainer.nativeElement.scrollTo(
        0,
        this.messagesContainer.nativeElement.scrollHeight
      );
      this.scrollToBottom = false;
    }
  }

  inputKeyup(e: KeyboardEvent) {
    const chatInput = e.target as HTMLInputElement;
    if (e.keyCode === 13) {
      this.chatService.sendMessage(chatInput.value);
      chatInput.value = "";
    }
  }
}
