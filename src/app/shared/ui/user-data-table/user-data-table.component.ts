import { CommonModule, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  signal,
  WritableSignal,
} from '@angular/core';
import { User } from '../../user-data/types/user.type';

@Component({
  selector: 'app-user-data-table',
  standalone: true,
  imports: [NgIf, NgFor],
  template: `
    @if (list()) {
    <table class="table table--clickable">
      <thead>
        <tr>
          <th>Username</th>
          <th>First name</th>
          <th>Last name</th>
          <th>Email</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        @for (user of list(); track user.username) {
        <tr
        (click)="select(user)" 
        [class.table__tr--active]="user.username === active()?.username">
          <td>{{ user.username }}</td>
          <td>{{ user.first_name }}</td>
          <td>{{ user.last_name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.user_type }}</td>
        </tr>
        }
      </tbody>
    </table>
    } @else { loading... }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDataTableComponent {
  list = input.required<User[] | null>();
  activeChange = output<User | null>();
  active = input.required<User | null>();
  constructor() {
  }
  select(user: User) {
    this.activeChange.emit(user)
  }
}
