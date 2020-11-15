import { Component } from "@angular/core";
import { async } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { TestBed } from "@angular/core/testing";
import { GameService } from "./game.service";
import { UsersService } from "./users.service";
import { User } from "../models/user";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-blank-cmp",
  template: "",
})
class BlankComponent {}

describe("GameService", () => {
  let gameService: GameService;
  let usersService: UsersService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        /*
        RouterTestingModule.withRoutes([
          { path: "game", component: BlankComponent },
        ]),*/
      ],
      providers: [
        {
          provide: MatDialog,
          useValue: {},
        },
        {
          provide: MatSnackBar,
          useValue: {},
        },
        {
          provide: Router,
          useValue: {
            navigate: () => null,
          },
        },
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);

    gameService = TestBed.inject(GameService);
    usersService = TestBed.inject(UsersService);

    localStorage.clear();
    gameService.reset();
    usersService.reset();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("should be created", () => {
    expect(gameService).toBeTruthy();
  });

  it("test start", async(() => {
    function get_user(i) {
      const u = new User();
      u.id = i + 1;
      u.username = `Player${u.id}`;
      u.index = i;
      return u;
    }

    usersService.users = [get_user(0), get_user(1)];
    gameService.start().subscribe((game: any) => {
      expect(game.id).toEqual(1);
      gameService.draw();
      console.error(game);
    });

    const req = httpTestingController.expectOne(
      `${environment.url}/api/games/`
    );
    req.flush({
      id: 1,
      start_datetime: new Date(),
      token: "foo",
      shuffle_indices: Array(25).fill(0),
    });
  }));
});
