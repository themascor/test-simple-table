import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserDataService } from './shared/user-data/user-data.service';
import { UserDataTableComponent } from './shared/ui/user-data-table/user-data-table.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { UserDataFormComponent } from './shared/ui/user-data-form/user-data-form.component';
import { User } from './shared/user-data/types/user.type';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgIf,
    UserDataTableComponent,
    UserDataFormComponent,
    RouterOutlet,
    AsyncPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  public readonly userData = inject(UserDataService);
  title = 'test-simple-table';
  activeUser = signal<User | null>(null);
  openForm = signal<boolean>(false);
  usersTable = signal<User[]>([]);
  disabled = signal<boolean>(false);
  private destroy = new Subject<void>();

  ngOnInit(): void {
    this.reloadTable();
  }
  closeForm(isUpdated: boolean) {
    this.openForm.set(false);
    isUpdated && this.reloadTable();
  }

  changeUser(user: User | null) {
    if (user === null || this.disabled()) {
      return;
    }
    this.activeUser.set(user);
    this.openForm.set(true);
  }
  create() {
    if (this.disabled()) {
      return;
    }
    this.activeUser.set(null);
    this.openForm.set(true);
  }
  atDisableChange(isDisabled: boolean) {
    this.disabled.set(isDisabled);
  }
  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
  private reloadTable() {
    this.userData
      .getFullList()
      .subscribe((list) => this.usersTable.set(list || []));
  }
}
