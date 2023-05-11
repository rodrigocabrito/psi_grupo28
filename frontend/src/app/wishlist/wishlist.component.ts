import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { Game_wishlist } from '../games/game_wishlist'; 
import { GameService } from '../game_service/game.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit{
  wishlist : Game_wishlist[] = [];
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
    this.getList();
  }

  c(): void{
    alert(126);
  }

  getList(): void {
    this.GameService.getWishList(this.id)
    .subscribe( (list)=>{this.wishlist = list;} 
    );
  }

}
