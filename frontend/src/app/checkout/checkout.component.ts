import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user';
import { ActivatedRoute } from '@angular/router';
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
              private route: ActivatedRoute) { }

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
      this.removeGamesCarrinho()

      if(this.user) {
        this.adicionaGamesBiblioteca(this.user.cart)
        this.removeGamesWishlist(this.user.cart)
      }
    }
  }

  generateRandomNumber(): number {
    return Math.floor(Math.random() * 100) + 1;
  }

  removeGamesCarrinho(): void {
    if(this.user) {
      this.gameService.removeGamesFromCart(this.user);
    }
  }

  //TODO check
  removeGamesWishlist(cart: Game_cart[]): void {
    if(this.user) {
      this.gameService.removeGamesFromWishlist(this.user, cart);
    }

    /*if (this.user) {

      // convert Observable<Game_Wishlist> to plain Game_Wishlist
      this.gameService.getWishList(this.user.id)
        .pipe(
          map((gamesWishList: Game_wishlist[]) => {
            
            for (const gameWishList of gamesWishList) {
              const plainGameWishList: Game_wishlist = {
                id: gameWishList.id,
                name: gameWishList.name,
                image_p: gameWishList.image_p
              };

              this.gamesWishList.push(plainGameWishList);
            }

            if(this.user) {
              this.gameService.removeGamesFromWishlist(this.user, gamesWishList, cart);
            }

            return this.gamesWishList;
          })
        ).subscribe();
    }*/
  }

  //TODO check
  adicionaGamesBiblioteca(cart: Game_cart[]): void {
    this.gameService.getAllGames()
      .pipe(
        map((allGames: Game_search_DTO[]) => {
          
          for (const game of allGames) {
            const plainGame: Game_search_DTO = {
              id: game.id,
              name: game.name
            };

            this.allGames.push(plainGame);
          }

          if(this.user) {
            this.gameService.addGamesToLibrary(this.user, cart, this.allGames);
          }

          return this.allGames;
        })
      ).subscribe();
  }    
}
