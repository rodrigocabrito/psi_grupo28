import { Component } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { Game_wishlist } from '../games/game_wishlist';
import { GameService } from '../game_service/game.service'; 

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cart : Game_wishlist[] = [];
  id : string = "";

  constructor(
    private route: ActivatedRoute,
    private GameService: GameService
  ) {}

  ngOnInit(): void {
    const session = window.localStorage.getItem("session");
    if (session) {
      this.id = JSON.parse(session);
    }
    console.log(this.id)
    this.getCart();
  }

  getCart(): void {
    this.GameService.getCart(this.id)
    .subscribe( (cart1)=>{this.cart = cart1;} 
    );
  }
}


