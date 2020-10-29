import { Component, OnInit } from "@angular/core";
import { GameService } from "src/app/services/game.service";
import { UsersService } from "src/app/services/users.service";
import { MetaService } from "src/app/services/meta.service";

@Component({
  selector: "app-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.scss"],
})
export class ChartComponent implements OnInit {
  public chartOptions = {
    responsive: true,
    animation: false,
    scales: {
      yAxes: [
        {
          ticks: {
            min: 0,
            stepSize: 14,
            callback: this.meta.toBase14,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            min: 0,
          },
        },
      ],
    },
  };
  public chartLabels = Array.from(Array(14).keys());
  public chartType = "line";
  public chartLegend = true;
  public chartColors = [];
  public chartData = [];

  constructor(
    private gameService: GameService,
    private usersService: UsersService,
    private meta: MetaService
  ) {}

  ngOnInit() {
    this.gameService.onCardDrawn.subscribe(this.update.bind(this));
    this.update();
  }

  update() {
    for (const u of this.usersService.users) {
      this.chartColors.push({
        backgroundColor: u.color,
        borderColor: u.color,
      });
    }

    for (const u of this.usersService.users) {
      const cards = this.gameService.getCardsForPlayer(u);

      this.chartData[u.index] = {
        data: this.meta.getCummulativeSips(cards),
        label: u.username,
        fill: false,
        lineTension: 0,
      };
    }
  }
}
