import { Component, OnInit, Input } from "@angular/core";
import { trigger, transition, useAnimation } from "@angular/animations";
import { bounce } from "ng-animate";

@Component({
  selector: "app-player-item-bottle",
  templateUrl: "./player-item-bottle.component.html",
  styleUrls: ["./player-item-bottle.component.scss"],
  animations: [
    trigger("EnterAnimation", [transition(":enter", [useAnimation(bounce)])]),
  ],
})
export class PlayerItemBottleComponent implements OnInit {
  @Input() color: string;

  constructor() {}

  ngOnInit(): void {}
}
