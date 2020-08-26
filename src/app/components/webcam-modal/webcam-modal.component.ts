import { Component, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { WebcamImage } from "ngx-webcam";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-webcam-modal",
  templateUrl: "./webcam-modal.component.html",
  styleUrls: ["./webcam-modal.component.scss"],
})
export class WebcamModalComponent implements OnInit {
  public trigger: Subject<void> = new Subject<void>();
  public countDownSeconds: number;

  public internalRef;

  constructor(private dialogRef: MatDialogRef<WebcamModalComponent>) {}

  ngOnInit(): void {
    this.countDownSeconds = 3;
  }

  public triggerSnapshot(): void {
    this.internalRef = setInterval(() => {
      this.countDownSeconds--;
      if (this.countDownSeconds <= 0) {
        clearInterval(this.internalRef);
        this.trigger.next();
      }
    }, 1000);
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.dialogRef.close(webcamImage);
  }

  public close() {
    if (this.internalRef) {
      clearInterval(this.internalRef);
    }

    this.dialogRef.close();
  }
}
