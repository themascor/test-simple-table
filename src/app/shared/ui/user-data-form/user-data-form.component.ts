import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-user-data-form',
  standalone: true,
  imports: [],
  templateUrl: 'user-data-form.component.html',
  styleUrl: 'user-data-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDataFormComponent {}
