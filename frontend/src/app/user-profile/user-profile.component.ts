import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Game_search_DTO } from '../games/game_search_DTO';
import { User } from '../user';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit{

  user: User | undefined;
  followers: User[] = [];
  following: User[] = [];
  games: Game_search_DTO[] = [];
  lists: String[] = []; //TODO lists type & getter
  showAppC = false;
  id: string = '';
  visitorid: string = '';

  constructor(private userService: UserService, private route: ActivatedRoute,private router: Router) {}

  ngOnInit(): void {
    this.getUser();
    const session = window.localStorage.getItem("session");
    if (session) {
      this.visitorid = JSON.parse(session);
    }
    if(this.user){
      this.id = this.user.id
    }
  }

  getFollowers(id: string): void {
    alert("Este botão não faz nada. Para consultar os seguidores utilize o botão no dashboard.");
  }

  getFollowing(id: string): void {
    alert("Este botão não faz nada. Para consultar os utilizadores que segue utilize o botão no dashboard.");
  }

  getGamesLibrary(): void {
    alert("Este botão não faz nada. Para consultar os jogos que possui utilize o botão no dashboard.");
  }

  getWishlist(): void {
    this.router.navigate(['/wishlist',this.user?.id]);
  }

  addFollowing() {
    if(this.user) {
      this.userService.follow(this.visitorid,this.user.id)
      .subscribe();
      this.userService.followed(this.visitorid,this.user.id)
      .subscribe();
      this.refreshPage();
    }

  }

  refreshPage() {
    location.reload();
  }

  getUser(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.userService.getUser(id)
      .subscribe(user => {this.user = user});
  }

  
}
