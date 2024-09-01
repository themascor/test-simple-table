import { NgIf } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  signal,
  inject,
} from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '../../../shared/data/user-data/types/user.type';
import { UserDataService } from '../../../shared/data/user-data/user-data.service';
import { UserDataFormComponent } from '../../../shared/ui/user-data-form/user-data-form.component';
import { UserDataTableComponent } from '../../../shared/ui/user-data-table/user-data-table.component';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [NgIf, UserDataTableComponent, UserDataFormComponent],
  template: ` <div class="content-container">
    <div class="panel">
      <div class="panel__left">
        <button
          class="btn btn--primary"
          (click)="create()"
          [disabled]="disabled()"
        >
          Create User
        </button>
      </div>
      <div class="panel__right"></div>
    </div>
    <div class="panel">
      <div class="panel__left">
        <div class="card list-section">
          <app-user-data-table
            (activeChange)="changeUser($event)"
            [list]="usersTable()"
            [active]="activeUser()"
          >
          </app-user-data-table>
        </div>
      </div>
      <div class="panel__right">
        <div class="card form-section" *ngIf="openForm()">
          <app-user-data-form
            (closed)="closeForm($event)"
            [user]="activeUser()"
            (disabledChange)="atDisableChange($event)"
          ></app-user-data-form>
        </div>
      </div>
    </div>
  </div>`,
  styleUrl: './users-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersPageComponent implements OnInit, OnDestroy {
  public readonly userData = inject(UserDataService);
  activeUser = signal<User | null>(null);
  openForm = signal<boolean>(false);
  usersTable = signal<User[]>([]);
  disabled = signal<boolean>(false);
  private destroy = new Subject<void>();

  ngOnInit(): void {
    this.reloadTable();
  }
  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
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
  private reloadTable() {
    this.userData
      .getFullList()
      .subscribe((list) => this.usersTable.set(list || []));
  }
}
