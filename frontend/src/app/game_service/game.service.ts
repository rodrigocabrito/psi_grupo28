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

  //TODO check
  rateGame(game: Game_detail, rating: number): Observable<Game_detail> {
    game.rates.push(rating);
    game.rating = this.calculateRate(game.rates);

    return this.http.post<Game_detail>(`${this.gameUrl}/${game.id}`, game, this.httpOptions).pipe(
      tap((game: Game_detail) => this.log(`rated game w/ id=${game.id}`)),
      catchError(this.handleError<Game_detail>('rateGame'))
    );
  }

  calculateRate(rates: number[]): number {
    const i = rates.length;
    const sum = rates.reduce((accumulator, currentValue) => accumulator + currentValue);

    return sum / i;
  }

  //TODO check
  addCommentGame(game: Game_detail, comment: string): Observable<Game_detail> {
    game.comment.push(comment);

    return this.http.post<Game_detail>(`${this.gameUrl}/${game.id}`, game, this.httpOptions).pipe(
      tap((game: Game_detail) => this.log(`comment added to game w/ id=${game.id}`)),
      catchError(this.handleError<Game_detail>('addCommentGame'))
    );
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
  removeGamesFromWishlist(user: User, cart: Game_cart[]): Observable<User> {
    if (!user || !user.id) {
      throw new Error('User ID is undefined');
    }

    // Remove the games that are in both the cart and the wishList
    user.wishList = user.wishList.filter(wishListGame => {
      const isCartGame = cart.some(cartGame => cartGame.id === wishListGame.id);
      return !isCartGame;
    });

    /*for (const gameWL of user.wishList) {
      const game = cart.find(gameCart => gameCart.id === gameWL.id);
      
      if (!game) {
        throw new Error(`Game with name ${gameWL.name} not found`);
      } else {
        const index = user.wishList.findIndex(gameCart => gameCart.id === gameWL.id);
        user.wishList.splice(index, 1);
      }
    }*/

    return this.http.post<User>(`${this.gameUrl}/spliceWishList/${user.id}`, user, this.httpOptions).pipe(
      tap((user: User) => this.log(`games in cart removed from whishlist of user w/ id=${user.id}`)),
      catchError(this.handleError<User>('removeGamesFromWishList'))
    );
  }

  // TODO: check
  addGamesToLibrary(user: User, cart: Game_cart[], allGames: Game_search_DTO[]): Observable<User> {
    if (!user || !user.id) {
      throw new Error('User ID is undefined');
    }
    const games: Game_search_DTO[] = [];

    for (const gameCart of cart) {
      const game = allGames.find(game => game.id === gameCart.id);
      
      if (!game) {
        throw new Error(`Game with name ${gameCart.name} not found`);
      } else {
        games.push(game);
      }
    }
    user.games.push(...games);

    return this.http.post<User>(`${this.gameUrl}/updateLibrary/${user.id}`, user, this.httpOptions).pipe(
      tap((user: User) => this.log(`added games to library of user w/ id=${user.id}`)),
      catchError(this.handleError<User>('addGamesToLibrary'))
    );
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
