import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { Game_search_DTO } from '../games/game_search_DTO';
import { Game_detail } from '../games/game_detail';
import { MessageService } from '../message.service';
import { Game_wishlist } from '../games/game_wishlist';
import { Game_cart } from '../games/game_cart';
import { User } from '../user';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private gamesUrl = 'http://appserver.alunos.di.fc.ul.pt:3078/games';
  private gameUrl = 'http://appserver.alunos.di.fc.ul.pt:3078/game';
  

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

  //TODO check
  rateGame(gameId: string, rating: number): Observable<boolean> {
    return this.http.post<boolean>(`${this.gameUrl}/rate`, {gameId: gameId, rating: rating}, this.httpOptions);
  }

  /*
  calculateRate(rates: number[]): number {
    const i = rates.length;
    const sum = rates.reduce((accumulator, currentValue) => accumulator + currentValue);

    return sum / i;
  }*/

  //TODO check
  addCommentGame(gameId: string, comment: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.gameUrl}/comment`, {gameId: gameId, comment: comment}, this.httpOptions);
  }

  // GET all games TODO: check
  getAllGames(): Observable<Game_search_DTO[]> {
    return this.http.get<string[]>(`${this.gamesUrl}/ids`).pipe(
      tap(_ => this.log('fetched game ids')),
      catchError(this.handleError<string[]>('getAllGameIds', [])),
      switchMap(ids => {
        const requests = ids.map(id => this.getGameSearchDTO(id));
        return forkJoin(requests);
      })
    );
  }

  /** GET game by id. Will 404 if id not found */
  getGameSearchDTO(id: String): Observable<Game_search_DTO> {
    const url = `${this.gamesUrl}/${id}`;
    return this.http.get<Game_search_DTO>(url).pipe(
      tap(_ => this.log(`fetched game id=${id}`)),
      catchError(this.handleError<Game_search_DTO>(`getGame id=${id}`))
    );
  }

  getGameDetail(id: String): Observable<Game_detail> {
    const url = `${this.gameUrl}/${id}`;
    return this.http.get<Game_detail>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Game_detail>(`getGame id=${id}`))
    );
  }

  //TODO maybe remove
  getWishList(id: string): Observable<Game_wishlist[]> {
    return this.http.get<Game_wishlist[]>(`${this.gamesUrl}/wishlist/${id}`).pipe(
     catchError(this.handleError<Game_wishlist[]>('wishlist', []))
   );
  }

  addWishList(session: string, gameId: string): Observable<boolean>{
    return this.http.post<boolean>(`${this.gameUrl}/towish`,{userId: session, gameId: gameId}, this.httpOptions);
  }

  removeWish(id: string, gameId: string): Observable<boolean>{
    return this.http.post<boolean>(`${this.gamesUrl}/rmwish`, {userId: id, gameId: gameId}, this.httpOptions);
  }

  getCart(id: string): Observable<Game_cart[]> {
    return this.http.get<Game_cart[]>(`${this.gamesUrl}/cart/${id}`).pipe(
     catchError(this.handleError<Game_cart[]>('cart', []))
   );
  }

  addCart(session: string, gameId: string): Observable<boolean>{
    return this.http.post<boolean>(`${this.gameUrl}/tocart`,{userId: session, gameId: gameId}, this.httpOptions);
  }

  /**POST: empties cart from user */
  removeGamesFromCart(id: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.gamesUrl}/emptyCart`, {userId: id}, this.httpOptions);
  }

  removeFromCart(id: string, gameId: string): Observable<boolean>{
    return this.http.post<boolean>(`${this.gamesUrl}/rmcart`, {userId: id, gameId: gameId}, this.httpOptions);
  }

  removeOneFromCart(id: string, gameId: string): Observable<boolean>{
    return this.http.post<boolean>(`${this.gamesUrl}/rmonecart`, {userId: id, gameId: gameId}, this.httpOptions);
  }

  //TODO check
  removeGamesFromWishlist(userId: string, cart: Game_cart[]): Observable<boolean> {
    return this.http.post<boolean>(`${this.gamesUrl}/filterWishList`, {userId: userId, cart: cart}, this.httpOptions);
  }

  // TODO: check
  addGamesToLibrary(userId: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.gamesUrl}/updateLibrary`, {userId: userId} , this.httpOptions);
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
