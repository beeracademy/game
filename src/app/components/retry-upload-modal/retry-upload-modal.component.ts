import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-retry-upload-modal',
  templateUrl: './retry-upload-modal.component.html',
  styleUrls: ['./retry-upload-modal.component.scss']
})
export class RetryUploadModalComponent implements OnInit {
  private intervalRef: any;

  constructor(
    public dialogRef: MatDialogRef<RetryUploadModalComponent>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) private data: any) {
    // Retry every 5s
    this.intervalRef = setInterval(this.upload.bind(this), 5000);

    this.dialogRef.beforeClosed().subscribe(() => {
      clearInterval(this.intervalRef);
    });
  }

  ngOnInit() {
  }

  public download() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.data.game));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href',     dataStr);
    downloadAnchorNode.setAttribute('download', 'game_' + this.data.game.id + '.json');
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  private upload() {
    return this.http.post(`${environment.url}/api/games/` + this.data.game.id + '/update_state/', this.data.game).subscribe(() => {
      clearInterval(this.intervalRef);
      this.dialogRef.close();
    });
  }
}
