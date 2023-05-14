import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { Game_search_DTO } from '../games/game_search_DTO';
import { ActivatedRoute } from '@angular/router';
import { Game_wishlist } from '../games/game_wishlist';
import { GameService } from '../game_service/game.service';
import { Game_cart } from '../games/game_cart';
import { Game_library } from '../games/game_library';

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
  games: Game_library[] = [];
  lists: String[] = []; //TODO lists type & getter
  showAppC = false;
  id: string = ''; //TODO get self id
  hideListas = true;
  hideGames = true;
  hideFollowers = true;
  hideFollowing = true;
  clickedBeforeDate = false;
  clickedBeforeName = false;

  constructor(private userService: UserService,private gameService: GameService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    const session = window.localStorage.getItem("session");
    if (session) {
      this.id = JSON.parse(session);
    }
    //this.getFollowers(this.id);
    //this.getFollowing(this.id);
    this.getUser();
    this.getGamesLibrary();
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

  getGamesLibrary(): void {
    this.userService.getGamesLibrary(this.id)
    .subscribe((games)=>{this.games = games;} );;
  }

  getGamesLibraryWithCounts(): Game_library[] {
    const gameLibraryWithCounts: Game_library[] = [];
    const itemCounts: { [key: string]: number } = {};

  
    for (const game of this.games) {
      if (!itemCounts[game.id]) {
        itemCounts[game.id] = 1;
        gameLibraryWithCounts.push(game);
        const index = gameLibraryWithCounts.findIndex(g => g.id === game.id);
        gameLibraryWithCounts[index].quantity = 1;
      } else {
        itemCounts[game.id]++;
        const index = gameLibraryWithCounts.findIndex(g => g.id === game.id);
        gameLibraryWithCounts[index].quantity = itemCounts[game.id];
      }
    }
  
    return gameLibraryWithCounts;
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

  sortByDate(games: Game_library[]){
    if(this.clickedBeforeDate) {
      games.sort((a, b) => (a.date < b.date ? -1 : 1));
      this.clickedBeforeDate = false;
    } else {
      games.sort((a, b) => (a.date < b.date ? -1 : 1));
      this.clickedBeforeDate = true;
    }
  } 

  sortByName(games: Game_library[])  {
    if(this.clickedBeforeName) {
      games.sort((a, b) => a.name.localeCompare(b.name));
      this.clickedBeforeName = false;
    } else {
      games.sort((a, b) => -1 * a.name.localeCompare(b.name));
      this.clickedBeforeName = true;
    }
  }

  gameToDate(game: Game_library) {
    let dateNew = new Date(game.date);
    console.log(game.date);
    return dateNew.getHours() + ":" + dateNew.getMinutes() + ":" + dateNew.getSeconds();
  }
}
