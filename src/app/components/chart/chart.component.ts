import { Component, OnInit } from "@angular/core";
import { GameService } from "src/app/services/game.service";
import { UsersService } from "src/app/services/users.service";
import { MetaService } from "src/app/services/meta.service";
import { ChartConfiguration, ChartOptions, LegendItem } from "chart.js";

@Component({
  selector: "app-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.scss"],
})
export class ChartComponent implements OnInit {
  public chartOptions: ChartOptions<"line"> = {
    responsive: true,
    animation: false,
    scales: {
      y: {
        min: 0,
        ticks: {
          stepSize: 14,
          callback: this.meta.toBase14,
        },
      },
      x: {
        min: 0,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${this.meta.toBase14(
              context.parsed.y
            )}`;
          },
        },
      },
    },
    /*
    plugins: {
      legend: {
        labels: {
          generateLabels: function (x): LegendItem[] {
            return [];
          },
        },
      },
    },*/
  };
  public chartData: ChartConfiguration<"line">["data"] = {
    labels: Array.from(Array(14).keys()),
    datasets: [],
  };

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
    this.chartData.datasets = [];

    for (const u of this.usersService.users) {
      const cards = this.gameService.getCardsForPlayer(u);

      this.chartData.datasets[u.index] = {
        data: this.meta.getCummulativeSips(cards),
        label: u.username,
        fill: false,
        tension: 0,
        borderColor: u.color,
        backgroundColor: u.color,
        pointBorderColor: u.color,
        pointBackgroundColor: u.color,
      };
    }

    // Needed to make Angular redraw the chart
    this.chartData = {
      labels: this.chartData.labels,
      datasets: this.chartData.datasets,
    };
  }
}
