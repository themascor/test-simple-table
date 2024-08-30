import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserDataService } from './shared/user-data/user-data.service';
import { UserDataTableComponent } from './shared/ui/user-data-table/user-data-table.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UserDataTableComponent, RouterOutlet, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public readonly userData = inject(UserDataService);
  title = 'test-simple-table';
}
