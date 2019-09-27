import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { LoginModalComponent } from './components/login-modal/login-modal.component';
import { LoginComponent } from './views/login/login.component';
import { MatInputModule, MatBottomSheetModule } from '@angular/material';
import { LoginModalItemComponent } from './components/login-modal-item/login-modal-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { GameComponent } from './views/game/game.component';
import { ChugModalComponent } from './components/chug-modal/chug-modal.component';
import { FinishModalComponent } from './components/finish-modal/finish-modal.component';
import { PlayersComponent } from './components/players/players.component';
import { PlayersItemComponent } from './components/players-item/players-item.component';
import { InfoBarComponent } from './components/info-bar/info-bar.component';
import { CardTableComponent } from './components/card-table/card-table.component';
import { SpinnerModalComponent } from './components/spinner-modal/spinner-modal.component';
import { ChartComponent } from './components/chart/chart.component';
import { ChartsModule } from 'ng2-charts';
import { CardDeckComponent } from './components/card-deck/card-deck.component';
import { CardDeckItemComponent } from './components/card-deck-item/card-deck-item.component';
import { RetryUploadModalComponent } from './components/retry-upload-modal/retry-upload-modal.component';
import { TextFlashModalComponent } from './components/text-flash-modal/text-flash-modal.component';
import { ChugsComponent } from './components/chugs/chugs.component';
import { ChugsItemComponent } from './components/chugs-item/chugs-item.component';
import { MobileControlsComponent } from './components/mobile-controls/mobile-controls.component';
import { StatsModalComponent } from './components/stats-modal/stats-modal.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    LoginModalComponent,
    LoginComponent,
    LoginModalItemComponent,
    ConfirmModalComponent,
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
    StatsModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MaterialModule,
    MatBottomSheetModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  entryComponents: [
    ConfirmModalComponent,
    ChugModalComponent,
    FinishModalComponent,
    SpinnerModalComponent,
    RetryUploadModalComponent,
    StatsModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
