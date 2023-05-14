import { Component } from '@angular/core';
import { Router} from '@angular/router';
import { Game_cart } from './games/game_cart';
import { GameService } from './game_service/game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Oasis Gaming';
  loginId ="";
  cart: Game_cart[] = [];
  

  constructor(private router: Router,private gameService: GameService) {}

  ngOnInit(): void {
    const session = window.localStorage.getItem("session");
    if (session) {
      this.loginId = JSON.parse(session);
    }
    this.getCart();
  }

  // Add a method to check the current route
  isRoute(route: string): boolean {
    return this.router.url.includes(route);
  }

  getCart(): void{
    this.gameService.getCart(this.loginId)
      .subscribe(cart => this.cart = cart);
  }

  getWishlist(): void {
    this.router.navigate(['/wishlist',this.loginId]).then(() => {
      location.reload();
    });
  }

  getProfile(): void {
    this.router.navigate(['/user-profile',this.loginId]).then(() => {
      location.reload();
    });
  }
}
