import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user';
import { ActivatedRoute, Router } from '@angular/router';
import { Game_wishlist } from '../games/game_wishlist';
import { GameService } from '../game_service/game.service';
import { Game_search_DTO } from '../games/game_search_DTO';
import { map } from 'rxjs/operators';
import { Game_cart } from '../games/game_cart';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {

  user: User | undefined
  allGames: Game_search_DTO[] = [];
  gamesWishList: Game_wishlist[] = [];

  constructor(private userService: UserService,
              private gameService: GameService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.getUser();
  }

  getUser(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.userService.getUser(id)
      .subscribe(user => this.user = user);
  }

  finalizeBuy() {
    const randomNumber = this.generateRandomNumber();

    if (randomNumber <= 50) {
      alert('Infelizmente, a compra não foi bem sucedida.');
    } else {
      alert('Compra realizada com sucesso!');

      if(this.user) {
        this.adicionaGamesBiblioteca();
        this.removeGamesWishlist();
        this.removeGamesCarrinho();

        this.router.navigate(['/dashboard', this.user.id]).then(() => {
          location.reload();
        });
      }

      //TODO redirect to dashboard page
    }
  }

  generateRandomNumber(): number {
    return Math.floor(Math.random() * 100) + 1;
  }

  removeGamesCarrinho(): void {
    if(this.user) {
      this.gameService.removeGamesFromCart(this.user.id)
      .subscribe();
    }
  }

  //TODO check
  removeGamesWishlist(): void {
    if(this.user) {
      this.gameService.removeGamesFromWishlist(this.user.id, this.user.cart)
      .subscribe();
    }
  }

  //TODO check
  adicionaGamesBiblioteca(): void {
    if(this.user) {
      this.gameService.addGamesToLibrary(this.user.id)
      .subscribe();
    }
  }    
}
