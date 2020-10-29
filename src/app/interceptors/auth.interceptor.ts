import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { UsersService } from "../services/users.service";
import { GameService } from "../services/game.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private usersService: UsersService,
    private gameService: GameService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      this.usersService.users.length > 0 &&
      this.gameService.game.start_datetime
    ) {
      request = request.clone({
        setHeaders: {
          Authorization: "GameToken " + this.gameService.game.token,
        },
      });
    }

    return next.handle(request);
  }
}
