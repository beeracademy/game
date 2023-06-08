import { inject, NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./views/login/login.component";
import { GameComponent } from "./views/game/game.component";
import { GameService } from "./services/game.service";

function isGameStarted(): boolean {
  return inject(GameService).game.start_datetime !== "";
}

const routes: Routes = [
  {
    path: "",
    component: GameComponent,
    canMatch: [isGameStarted],
    runGuardsAndResolvers: "always",
  },
  {
    path: "",
    component: LoginComponent,
    runGuardsAndResolvers: "always",
  },

  // otherwise redirect to home
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      relativeLinkResolution: "legacy",
      onSameUrlNavigation: "reload",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
