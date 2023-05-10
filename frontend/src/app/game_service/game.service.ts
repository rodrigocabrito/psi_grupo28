import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Game_search_DTO } from '../games/game_search_DTO';
import { Game_detail } from '../games/game_detail';
import { MessageService } from '../message.service';
import { Game_wishlist } from '../games/game_wishlist';
import { Game_cart } from '../games/game_cart';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private gamesUrl = 'http://localhost:3078/games';
  private gameUrl = 'http://localhost:3078/game';
  

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  searchGames(term: string): Observable<Game_search_DTO[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    console.log(term+"12");
    return this.http.get<Game_search_DTO[]>(`${this.gamesUrl}/search/${term}`).pipe(
      tap(x => x.length ?
        this.log(`found heroes matching "${term}"`) :
        this.log(`no heroes matching "${term}"`)),
     catchError(this.handleError<Game_search_DTO[]>('searchHeroes', []))
   );
  }

  /*
  rateGame(gameName: string, rating: number) {
    game = getGame(gameName); //TODO
    game.rating.push(rating); // create game, create game.rating[]:number
  }

  addComment(gameName: string, comment: string) {
    game = getGame(gameName); //TODO
    game.comments.push(comment); // create game.comments[]:string
  }
  */
  getGameDetail(id: String): Observable<Game_detail> {
    const url = `${this.gameUrl}/${id}`;
    return this.http.get<Game_detail>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Game_detail>(`getGame id=${id}`))
    );
  }

  getWishList(id: string): Observable<Game_wishlist[]> {
    return this.http.get<Game_wishlist[]>(`${this.gamesUrl}/wishlist/${id}`).pipe(
     catchError(this.handleError<Game_wishlist[]>('wishlist', []))
   );
  }

  addWishList(session: string, gameId: string): Observable<boolean>{
    return this.http.post<boolean>(`${this.gameUrl}/towish`,{userId: session, gameId: gameId}, this.httpOptions);
  }

  getCart(id: string): Observable<Game_cart[]> {
    return this.http.get<Game_cart[]>(`${this.gamesUrl}/cart/${id}`).pipe(
     catchError(this.handleError<Game_cart[]>('cart', []))
   );
  }

  addCart(session: string, gameId: string): Observable<boolean>{
    return this.http.post<boolean>(`${this.gameUrl}/tocart`,{userId: session, gameId: gameId}, this.httpOptions);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
