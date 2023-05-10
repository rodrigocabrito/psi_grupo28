
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Game_search_DTO } from '../games/game_search_DTO';
import { User } from '../user';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

    user: User | undefined;
    followers: User[] = [];
    following: User[] = [];
    games: Game_search_DTO[] = [];
    lists: String[] = []; //TODO lists type & getter
    showAppC = false;
    id: string = '';
  
    constructor(private userService: UserService, private route: ActivatedRoute) {}
  
    ngOnInit(): void {
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
  
    getWishlish(id: string): void {
      
    }
  
    getUser(): void {
      const session = window.localStorage.getItem("session");
    if (session) {
      this.id = JSON.parse(session);
    }
      this.userService.getUser(id)
        .subscribe(user => this.user = user);
    }
}
