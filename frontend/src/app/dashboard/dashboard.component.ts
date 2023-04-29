import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { Game_search_DTO } from '../games/game_search_DTO';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  user:User |undefined
  followers: User[] = [];
  following: User[] = [];
  games: Game_search_DTO[] = [];
  lists: String[] = []; //TODO lists type & getter
  showAppC = false;
  id: string = ''; //TODO get self id

  constructor(private userService: UserService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getFollowers(this.id);
    this.getFollowing(this.id);
    this.getGamesLibrary(this.id);
    this.getUser();
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

  getUser(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.userService.getUser(id)
      .subscribe(user => this.user = user);
  }
}
