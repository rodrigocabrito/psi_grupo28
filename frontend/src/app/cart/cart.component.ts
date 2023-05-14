import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../game_service/game.service'; 
import { Game_cart } from '../games/game_cart';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cart : Game_cart[] = [];
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
    .subscribe( (cart)=>{this.cart = cart;} 
    );
  }

  getSubtotal(): number {
    let subtotal = 0;
    for (let game of this.cart) {
      subtotal += game.price.valueOf();
    }
    return subtotal;
  }

  getCartWithCounts(): Game_cart[] {
    const cartWithCounts: Game_cart[] = [];
    const itemCounts: { [key: string]: number } = {};

  
    for (const game of this.cart) {
      if (!itemCounts[game.id]) {
        itemCounts[game.id] = 1;
        cartWithCounts.push(game);
      } else {
        itemCounts[game.id]++;
        const index = cartWithCounts.findIndex(g => g.id === game.id);
        cartWithCounts[index].quantity = itemCounts[game.id];
      }
    }
  
    return cartWithCounts;
  }

  addToCart(gameId:string): void{
    this.GameService.addCart(this.id, gameId)
    .subscribe();
  }

  removeAll(): void{
    this.GameService.removeGamesFromCart(this.id)
    .subscribe();
  }

  removeFromCart(gameId:string): void{
    this.GameService.removeFromCart(this.id, gameId)
    .subscribe();
  }

  removeOneFromCart(gameId:string): void{
    this.GameService.removeOneFromCart(this.id, gameId)
    .subscribe();
  }

  refreshPage() {
    location.reload();
  }
  
  
}


