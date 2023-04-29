import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Pet } from './pet';
import { MessageService } from './message.service';

import { User } from './user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  users: User[] = [];
  private PetsUrl = 'http://localhost:3000/pets';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private userService: UserService) { }


  getPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(this.PetsUrl)
      .pipe(
        tap(_ => this.log('fetched Pets')),
        catchError(this.handleError<Pet[]>('getPets', []))
      );
  }

  /** DELETE: delete the Pet from the server */
  deletePet(id: String): Observable<Pet> {
    const url = `${this.PetsUrl}/${id}`;
    debugger;
    var temp=[];
    this.userService.getUsers()
    .subscribe(users => this.find(users, id) );
    
    

    return this.http.delete<Pet>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted Pet id=${id}`)),
      catchError(this.handleError<Pet>('deletePet'))
    );
  }

  private find(h : User[], id : String){
    for (let index = 0; index < h.length; index++) {
      if (h[index].petname.id === id) {
        h[index] = {id: h[index].id, name: h[index].name, petname:{id:'',name:''}};

      }
      this.userService.updateUser(h[index])
        .subscribe();
    }
  }

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
  
  /** Log a PetService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`PetService: ${message}`);
  }
}
