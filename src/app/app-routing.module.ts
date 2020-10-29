import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./views/login/login.component";
import { LoginGuard } from "./guards/login.guard";
import { GameComponent } from "./views/game/game.component";

const routes: Routes = [
  {
    path: "",
    component: GameComponent,
    canActivate: [LoginGuard],
  },
  {
    path: "login",
    component: LoginComponent,
  },

  // otherwise redirect to home
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
