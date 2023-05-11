import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { Game_search_DTO } from '../games/game_search_DTO';
import { ActivatedRoute } from '@angular/router';
import { Game_wishlist } from '../games/game_wishlist';
import { GameService } from '../game_service/game.service';
import { Game_cart } from '../games/game_cart';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  user:User |undefined
  cart: Game_cart[] = [];
  followers: User[] = [];
  following: User[] = [];
  games: Game_search_DTO[] = [];
  lists: String[] = []; //TODO lists type & getter
  showAppC = false;
  id: string = ''; //TODO get self id
  hideListas = true;
  hideGames = true;
  hideFollowers = true;
  hideFollowing = true;

  constructor(private userService: UserService,private gameService: GameService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getFollowers(this.id);
    this.getFollowing(this.id);
    this.getGamesLibrary(this.id);
    this.getUser();
    this.getCart();
  }

  getFollowers(id: string): void {
    this.userService.getUserFollowers(id)
      .subscribe(followers => this.followers = followers);
  }

  getFollowing(id: string): void {
    this.userService.getUserFollowing(id)
      .subscribe(following => this.following = following);
  }

  getGamesLibrary(id: string): void {
    this.userService.getGamesLibrary(id)
    .subscribe(games => this.games = games);;
  }

  showListas(): void {
    this.hideListas = false;
    this.hideGames = true;
    this.hideFollowers = true;
    this.hideFollowing = true;
  }

  showGames(): void {
    this.hideListas = true;
    this.hideGames = false;
    this.hideFollowers = true;
    this.hideFollowing = true;
  }

  showFollowers(): void {
    this.hideListas = true;
    this.hideGames = true;
    this.hideFollowers = false;
    this.hideFollowing = true;
  }

  showFollowing(): void {
    this.hideListas = true;
    this.hideGames = true;
    this.hideFollowers = true;
    this.hideFollowing = false;
  }
  
  getUser(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.userService.getUser(id)
      .subscribe(user => this.user = user);
  }

  getCart(): void{
    const id = this.route.snapshot.paramMap.get('id')!;
    this.gameService.getCart(id)
      .subscribe(cart => this.cart = cart);
  }
}
