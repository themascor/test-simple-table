import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { mockUsers } from './mocked-list';
import { User } from './types/user.type';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private readonly usersTable: { [userName in string]: User } = mockUsers
    .slice()
    .reduce((acc, user) => ({ ...acc, [user.username]: user }), {});
  constructor() {}

  getFullList(): Observable<User[] | null> {
    return of(Object.values(this.usersTable));
  }
  update(user: User): Observable<boolean> {
    const isUserInTable = Object.prototype.hasOwnProperty.call(this.usersTable, user.username);
    if (isUserInTable) {
      this.usersTable[user.username] = { ...user };
      return of(true);
    } else {
      return throwError(() => ({ username: 'Cant find the user' }));
    }
  }
  delete(user: User): Observable<boolean> {
    const isUserInTable = Object.prototype.hasOwnProperty.call(this.usersTable, user.username);
    if (isUserInTable) {
      delete this.usersTable[user.username];
      return of(true);
    } else {
      return throwError(() => ({ username: 'Cant find the user' }));
    }
  }

  create(user: User): Observable<boolean> {
    const isUserInTable = Object.prototype.hasOwnProperty.call(this.usersTable, user.username);
    if (isUserInTable) {
      return throwError(() => ({ username: 'The user already exist' }));
    } else {
      this.usersTable[user.username] = { ...user };
      return of(true);
    }
  }
}
