import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { Game_wishlist } from '../games/game_wishlist'; 
import { GameService } from '../game_service/game.service';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit{
  wishlist : Game_wishlist[] = [];
  id : string = "";
  user:User | undefined;

  constructor(
    private route: ActivatedRoute,
    private GameService: GameService,
    private userService:UserService
  ) {}

  ngOnInit(): void {
    const session = window.localStorage.getItem("session");
    if (session) {
      this.id = JSON.parse(session);
    }
    console.log(this.id)
    this.getList();
    this.getUser();
  }

  c(): void{
    alert('Jogo removido.');
  }

  removeWish(gameId:string): void{
    this.GameService.removeWish(this.id, gameId)
    .subscribe();
  }

  getList(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.GameService.getWishList(id)
    .subscribe( (list)=>{this.wishlist = list;} 
    );
  }

  check(): boolean{
    const id = this.route.snapshot.paramMap.get('id')!;
    return id === this.id;
  }

  refreshPage(){
    location.reload();
  }

  getUser(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.userService.getUser(id)
      .subscribe(user => this.user = user);
  }

}
