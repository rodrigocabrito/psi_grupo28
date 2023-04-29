import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { Game_search_DTO } from '../games/game_search_DTO';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  followers: User[] = [];
  following: User[] = [];
  games: Game_search_DTO[] = [];
  lists: String[] = []; //TODO lists type & getter
  showAppC = false;
  id: string = ''; //TODO get self id

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getFollowers(this.id);
    this.getFollowing(this.id);
    this.getGamesLibrary(this.id);
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
}
