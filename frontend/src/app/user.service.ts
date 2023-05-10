import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from './user';
import { MessageService } from './message.service';

import { userRegister } from './userRegister';
import { Game_search_DTO } from './games/game_search_DTO';


@Injectable({ providedIn: 'root' })
export class UserService {

  private usersUrl = 'http://localhost:3078/users';  // URL to web api
  private userUrl = 'http://localhost:3078/user';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET users from the server */
  getUsers(): Observable<User[]> {
    var p = this.http.get<User[]>(this.usersUrl);
    console.log(p);
    return p;  
  }

  /** GET user by id. Return `undefined` when id not found */
  getUserNo404<Data>(id: String): Observable<User> {
    const url = `${this.usersUrl}/?id=${id}`;
    return this.http.get<User[]>(url)
      .pipe(
        map(users => users[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
          this.log(`${outcome} user id=${id}`);
        }),
        catchError(this.handleError<User>(`getUser id=${id}`))
      );
  }

  /** GET user by id. Will 404 if id not found */
  getUser(id: String): Observable<User> {
    const url = `${this.userUrl}/${id}`;
    return this.http.get<User>(url).pipe(
      tap(_ => this.log(`fetched user id=${id}`)),
      catchError(this.handleError<User>(`getUser id=${id}`))
    );
  }

  /** GET user by name. Will 404 if id not found */
  searchUser(name: string): Observable<User> {
    const url = `${this.usersUrl}/?name=${name}`;
    return this.http.get<User[]>(url)
      .pipe(
        map(users => users[0]), // returns the first user whose name matches the search term
        tap(user => {
          const outcome = user ? 'fetched' : 'did not find';
          this.log(`${outcome} user with name=${name}`);
        }),
        catchError(this.handleError<User>(`searchUser name=${name}`))
      );
  }
  

  /* GET users whose name contains search term */
  searchUsers(term: string): Observable<User[]> {
    if (!term.trim()) {
      // if not search term, return empty user array.
      return of([]);
    }
    return this.http.get<User[]>(`${this.usersUrl}/search/${term}`).pipe(
      tap(x => x.length ?
         this.log(`found users matching "${term}"`) :
         this.log(`no users matching "${term}"`)),
      catchError(this.handleError<User[]>('searchUsers', []))
    );
  }

  /* GET user's followers */
  getUserFollowers(id: string): Observable<User[]> {
    const url = `${this.userUrl}/followers/${id}`;
    return this.http.get<User>(url).pipe(
      map(user => user.followers),
      tap(_ => this.log(`fetched user's followers id=${id}`)),
      catchError(this.handleError<User[]>(`getUserFollowers id=${id}`))
    );
  }

  followerHandler(userSelf: User, userToFollow: User): Observable<User> {
    userToFollow.followers.push(userSelf);
    return this.http.post<User>(`${this.userUrl}/${userToFollow.id}`, userToFollow, this.httpOptions).pipe(
      tap((user: User) => this.log(`added a user to the followers of user w/ id=${user.id}`)),
      catchError(this.handleError<User>('registerUser'))
    );
  }
  
  /* GET users that the user with the given id is following*/
  getUserFollowing(id: string): Observable<User[]> {
    const url = `${this.userUrl}/following/${id}`;
    return this.http.get<User>(url).pipe(
      map(user => user.followers),
      tap(_ => this.log(`fetched user's followers id=${id}`)),
      catchError(this.handleError<User[]>(`getUserFollowers id=${id}`))
    );
  }

  followerHandler2(userSelf: User, userToFollow: User): Observable<User> {
    userSelf.following.push(userToFollow);
    return this.http.post<User>(`${this.userUrl}/${userSelf.id}`, userSelf, this.httpOptions).pipe(
      tap((user: User) => this.log(`added a user to the following of user w/ id=${user.id}`)),
      catchError(this.handleError<User>('registerUser'))
    );
  }

  /* GET all games from the user with the given id*/
  getGamesLibrary(id: string): Observable<Game_search_DTO[]> {
    const url = `${this.userUrl}/gamesLibrary/${id}`;
    return this.http.get<User>(url).pipe(
      map(user => user.games),
      tap(_ => this.log(`fetched user's games id=${id}`)),
      catchError(this.handleError<User[]>(`getGamesLibrary id=${id}`))
    );
  }

  //////// Save methods //////////

  /** POST: add a new user to the server */
  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.userUrl, user, this.httpOptions).pipe(
      tap((newUser: User) => this.log(`added user w/ id=${newUser.id}`)),
      catchError(this.handleError<User>('addUser'))
    );
  }

  registerUser(user: userRegister): Observable<User> {
    const url = `${this.usersUrl}/register/${user.username}/${user.password}`;
    return this.http.post<User>(this.usersUrl, {username:user.username, password:user.password}, this.httpOptions).pipe(
      tap((newUser: User) => this.log(`added user w/ id=${newUser.id}`)),
      catchError(this.handleError<User>('registerUser'))
    );
  }

  loginUser(user: userRegister): Observable<User> {
    const url = `${this.userUrl}/login/${user.username}/${user.password}`;
    return this.http.get<User>(url).pipe(
      tap((newUser: User) => this.log(`added user w/ id=${newUser.id}`)),
      catchError(this.handleError<User>('addUser'))
    );
  }

  /** DELETE: delete the user from the server */
  deleteUser(id: String): Observable<User> {
    const url = `${this.userUrl}/${id}`;

    return this.http.delete<User>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted user id=${id}`)),
      catchError(this.handleError<User>('deleteUser'))
    );
  }

  /** PUT: update the user on the server */
  updateUser(user: User): Observable<any> {
    const url = `${this.userUrl}/${user.id}`;
    return this.http.put(url, user, this.httpOptions).pipe(
      tap(_ => this.log(`updated user id=${user.id}`)),
      catchError(this.handleError<any>('updateUser'))
    );
  }

  /*
  removeItemsFromCart(user: User, items: string[]): void {
    user.cart = user.cart.filter(item => !items.includes(item.name));
  }

  removeItemsFromWishlist(user: User, items: string[]): void {
    user.wishlist = user.wishlist.filter(item => !items.includes(item.name));
  }

  addItemToLibrary(user: User, items: string[]): void {
    const itemsToAdd: Game[] = [];
    for (const item1 of items) {
      const item = this.items.find((item) => item.name === item1);
      if (!item) {
        throw new Error(`Game with name ${itemName} not found`);
      }
      itemsToAdd.push(item);
    }
    user.cart.push(...itemsToAdd);
  }
  */

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
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

  /** Log a UserService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`UserService: ${message}`);
  }
}
