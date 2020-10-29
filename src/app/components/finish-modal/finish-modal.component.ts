import { Component, OnInit, Inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from "@angular/material/dialog";
import { Game } from "src/app/models/game";
import { SoundService } from "src/app/services/sound.service";
import { WebcamModalComponent } from "../webcam-modal/webcam-modal.component";
import { WebcamImage } from "ngx-webcam";
import { HttpBackend, HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-finish-modal",
  templateUrl: "./finish-modal.component.html",
  styleUrls: ["./finish-modal.component.scss"],
})
export class FinishModalComponent implements OnInit {
  public duration: number;
  public description: string;

  public webcamImage: WebcamImage;
  public showImageSpinner = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FinishModalComponent>,
    private sounds: SoundService,
    private dialog: MatDialog,
    private http: HttpClient
  ) {
    const game: Game = this.data.game;

    this.description = game.description;

    if (!(window as any).cold) {
      this.sounds.play("cheering");
    }
  }

  ngOnInit() {}

  public done() {
    this.dialogRef.close(this.description);
  }

  public addPhoto() {
    this.dialog
      .open(WebcamModalComponent, {
        disableClose: true,
      })
      .afterClosed()
      .subscribe((image: WebcamImage) => {
        if (!image) {
          return;
        }

        this.showImageSpinner = true;
        const formData = new FormData();
        formData.append("image", this.dataURLtoBlob(image.imageAsDataUrl));

        this.http
          .post(
            `${environment.url}/api/games/${this.data.game.id}/update_image/`,
            formData
          )
          .subscribe(
            (res) => {
              this.webcamImage = image;
              this.showImageSpinner = false;
            },
            (err) => {
              this.showImageSpinner = false;
            }
          );
      });
  }

  public removePhoto() {
    this.webcamImage = null;
    this.showImageSpinner = true;

    this.http
      .post(
        `${environment.url}/api/games/${this.data.game.id}/delete_image/`,
        null
      )
      .subscribe(
        (res) => {
          this.showImageSpinner = false;
        },
        (err) => {
          this.showImageSpinner = false;
        }
      );
  }

  private dataURLtoBlob(dataURI) {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }
}
