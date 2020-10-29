import { Component, OnInit } from "@angular/core";
import { fadeOut, rubberBand } from "ng-animate";
import { useAnimation, transition, trigger } from "@angular/animations";
import { FlashService } from "src/app/services/flash.service";

@Component({
  selector: "app-text-flash-modal",
  templateUrl: "./text-flash-modal.component.html",
  styleUrls: ["./text-flash-modal.component.scss"],
  animations: [
    trigger("animation", [
      transition(
        ":enter",
        useAnimation(rubberBand, {
          params: { timing: 0.5 },
        })
      ),
      transition(
        ":leave",
        useAnimation(fadeOut, {
          params: { timing: 0.3 },
        })
      ),
    ]),
  ],
})
export class TextFlashModalComponent implements OnInit {
  public show = false;
  public text = "";

  constructor(public flashService: FlashService) {}

  ngOnInit() {
    this.flashService.onFlashText.subscribe((text) => {
      this.text = text;
      this.show = true;

      setTimeout(() => {
        this.show = false;
      }, 1000);
    });
  }
}
