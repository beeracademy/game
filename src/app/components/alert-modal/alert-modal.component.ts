import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-alert-modal",
  templateUrl: "./alert-modal.component.html",
  styleUrls: ["./alert-modal.component.scss"],
})
export class AlertModalComponent implements OnInit {
  public text: string;

  constructor(@Inject(MAT_DIALOG_DATA) data) {
    this.text = data.text;
  }

  ngOnInit() {}
}
