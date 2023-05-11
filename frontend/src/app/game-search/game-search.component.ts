import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { Game_search_DTO } from '../games/game_search_DTO';
import { GameService } from '../game_service/game.service';

@Component({
  selector: 'app-game-search',
  templateUrl: './game-search.component.html',
  styleUrls: ['./game-search.component.css']
})
export class GameSearchComponent implements OnInit{
  games$!: Observable<Game_search_DTO[]>;
  b = true;
  private searchTerms = new Subject<string>();
  key:string="";

  constructor(private gameService: GameService) {}

  search(term: string): void {
    this.searchTerms.next(term);
    let y = true;
    this.games$.subscribe(x => {
      if (x.length === 0) {
        this.b = false;
      }else{
        this.b = true;
      }
    })
  }

  ngOnInit(): void {
    this.games$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.gameService.searchGames(term)),
      
    );
    document.addEventListener("keydown", (e) => this.key=e.key)
    document.addEventListener("click", (e) => this.key="click")
  }

  blurEvent(): void {
    let d = document.getElementById("show");
    if (d && this.key !== "Tab") {
      d.style.visibility = "hidden";
    } 
  }

  clickEvent(): void{
    console.log("123")
    let d = document.getElementById("show");
    if (d) {
      d.style.visibility = "visible";
    } 
  }

}
