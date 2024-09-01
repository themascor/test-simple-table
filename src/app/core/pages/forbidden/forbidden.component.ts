import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `<div id="main">
  <div class="fof">
        <h1>Forbidden. 403</h1>
  </div>
</div>`,
  styleUrl: './forbidden.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForbiddenComponent { }
