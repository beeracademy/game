import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./material.module";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./interceptors/auth.interceptor";
import { LoginModalComponent } from "./components/login-modal/login-modal.component";
import { LoginComponent } from "./views/login/login.component";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatInputModule } from "@angular/material/input";
import { LoginModalItemComponent } from "./components/login-modal-item/login-modal-item.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ConfirmModalComponent } from "./components/confirm-modal/confirm-modal.component";
import { AlertModalComponent } from "./components/alert-modal/alert-modal.component";
import { GameComponent } from "./views/game/game.component";
import { ChugModalComponent } from "./components/chug-modal/chug-modal.component";
import { FinishModalComponent } from "./components/finish-modal/finish-modal.component";
import { PlayersComponent } from "./components/players/players.component";
import { PlayersItemComponent } from "./components/players-item/players-item.component";
import { InfoBarComponent } from "./components/info-bar/info-bar.component";
import { CardTableComponent } from "./components/card-table/card-table.component";
import { SpinnerModalComponent } from "./components/spinner-modal/spinner-modal.component";
import { ChartComponent } from "./components/chart/chart.component";
import { NgChartsModule } from "ng2-charts";
import { CardDeckComponent } from "./components/card-deck/card-deck.component";
import { CardDeckItemComponent } from "./components/card-deck-item/card-deck-item.component";
import { RetryUploadModalComponent } from "./components/retry-upload-modal/retry-upload-modal.component";
import { TextFlashModalComponent } from "./components/text-flash-modal/text-flash-modal.component";
import { ChugsComponent } from "./components/chugs/chugs.component";
import { ChugsItemComponent } from "./components/chugs-item/chugs-item.component";
import { MobileControlsComponent } from "./components/mobile-controls/mobile-controls.component";
import { StatsModalComponent } from "./components/stats-modal/stats-modal.component";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { PlayerItemBottleComponent } from "./components/player-item-bottle/player-item-bottle.component";
import { CardFlashModalComponent } from "./components/card-flash-modal/card-flash-modal.component";
import { WebcamModalComponent } from "./components/webcam-modal/webcam-modal.component";
import { WebcamModule } from "ngx-webcam";
import { ChatComponent } from "./components/chat/chat.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginModalComponent,
    LoginComponent,
    LoginModalItemComponent,
    ConfirmModalComponent,
    AlertModalComponent,
    GameComponent,
    ChugModalComponent,
    FinishModalComponent,
    PlayersComponent,
    PlayersItemComponent,
    InfoBarComponent,
    CardTableComponent,
    SpinnerModalComponent,
    ChartComponent,
    CardDeckComponent,
    CardDeckItemComponent,
    RetryUploadModalComponent,
    TextFlashModalComponent,
    ChugsComponent,
    ChugsItemComponent,
    MobileControlsComponent,
    StatsModalComponent,
    PlayerItemBottleComponent,
    CardFlashModalComponent,
    WebcamModalComponent,
    ChatComponent,
  ],
  imports: [
    WebcamModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MaterialModule,
    MatBottomSheetModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
