import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mockUsers } from './mocked-list';
import { User } from './types/user.type';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor() { }

  getFullList(): Observable<User[] | null> {
    return of(mockUsers)
  }

}
