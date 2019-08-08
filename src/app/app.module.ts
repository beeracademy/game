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
import { MatInputModule } from '@angular/material';
import { LoginModalItemComponent } from './components/login-modal-item/login-modal-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateNewUserModalComponent } from './components/create-new-user-modal/create-new-user-modal.component';
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
import { AbortModalComponent } from './components/abort-modal/abort-modal.component';
import { TextFlashModalComponent } from './components/text-flash-modal/text-flash-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginModalComponent,
    LoginComponent,
    LoginModalItemComponent,
    CreateNewUserModalComponent,
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
    AbortModalComponent,
    TextFlashModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  entryComponents: [
    CreateNewUserModalComponent,
    ChugModalComponent,
    FinishModalComponent,
    SpinnerModalComponent,
    RetryUploadModalComponent,
    AbortModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
