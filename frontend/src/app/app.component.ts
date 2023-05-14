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
    console.log("this is  " + this.loginId)
    this.getCart();
  }

  // Add a method to check the current route
  isRoute(route: string): boolean {
    return this.router.url.includes(route);
  }

  getCart(): void{
    const session = window.localStorage.getItem("session");
    if (session) {
      const loginId = JSON.parse(session);
      this.gameService.getCart(loginId)
      .subscribe(cart => this.cart = cart);
    } 
  }


  logout(): void{
    window.localStorage.removeItem('session');
    this.router.navigate(['']);
  }

  routeCart(): void {
    const session = window.localStorage.getItem("session");
    if (session) {
      const loginId = JSON.parse(session);
      this.router.navigate(['/cart',loginId]).then(() => {
      location.reload();
    });
    }
    
  }

  getWishlist(): void {
    const session = window.localStorage.getItem("session");
    if (session) {
      const loginId = JSON.parse(session);
      this.router.navigate(['/wishlist',loginId]).then(() => {
      location.reload();
    });
    }
    
  }

  getProfile(): void {
    const session = window.localStorage.getItem("session");
    if (session) {
      const loginId = JSON.parse(session);
      this.router.navigate(['/user-profile',loginId]).then(() => {
      location.reload();
    });
    }
    
  }
}
