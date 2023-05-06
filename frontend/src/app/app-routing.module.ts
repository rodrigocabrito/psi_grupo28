import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { GameDetailComponent } from './game-detail/game-detail.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { RatingComponent } from './rating/rating.component';
import { CartComponent } from './cart/cart.component';
import { GamesComponent } from './games/games.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'dashboard/:id', component: DashboardComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user-profile/:id', component: UserProfileComponent},
  { path: 'detail/:id', component: UserDetailComponent },
  { path: 'users', component: UsersComponent },
  { path: 'game/:id', component: GameDetailComponent},
  { path: 'checkout', component: CheckoutComponent },
  { path: 'rating', component: RatingComponent },
  { path: 'cart/:id', component: CartComponent },

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
