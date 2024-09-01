import {
  CommonModule,
  JsonPipe,
  NgFor,
  NgIf,
  NgTemplateOutlet,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { User, UserType } from '../../user-data/types/user.type';
import { FormsModule } from '@angular/forms';
import { UserFormType } from './types/user-form.type';
import { StrongPasswordValidatorDirective } from './validators/strong-password-validator.directive';
import { MatchValueValidatorDirective } from './validators/match-value-validator.directive';
import {
  SERVER_VALIDATION_TOKEN,
  ServerValidationErrors,
} from './validators/user-server-validator/server-validation-token.type';
import { ServerValidatorService } from './services/server-validator.service';
import { ValidationMessagesPipe } from './pipes/validation-messages.pipe';
import { UserDataService } from '../../user-data/user-data.service';
import { delay, Observable, Subject } from 'rxjs';
import { ServerValidatorDirective } from './validators/server-validator.directive';

@Component({
  selector: 'app-user-data-form',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    JsonPipe,
    NgTemplateOutlet,
    StrongPasswordValidatorDirective,
    MatchValueValidatorDirective,
    ValidationMessagesPipe,
    ServerValidatorDirective,
  ],
  providers: [
    {
      provide: SERVER_VALIDATION_TOKEN,
      useClass: ServerValidatorService,
    },
  ],
  templateUrl: 'user-data-form.component.html',
  styleUrl: 'user-data-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDataFormComponent implements OnDestroy {
  @ViewChild('userForm') form: any;

  public readonly closed = output<boolean>();
  public readonly disabledChange = output<boolean>();
  public readonly user = input<User | null>(null);
  private readonly userDataService = inject(UserDataService);
  private readonly serverValidatorService = inject(SERVER_VALIDATION_TOKEN);
  public readonly isItNewUser = computed(() => !this.user());
  public readonly disabled = signal(false);
  private readonly emptyModel: UserFormType = {
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    rePassword: '',
    user_type: UserType.DRIVER,
  };
  public readonly userTypes = signal<UserType[]>([
    UserType.ADMIN,
    UserType.DRIVER,
  ]);
  public model: UserFormType = { ...this.emptyModel };
  private destroy = new Subject<void>();
  constructor(private readonly cd: ChangeDetectorRef) {
    effect(() => {
      this.form?.reset();
      this.model =
        this.user() === null
          ? { ...this.emptyModel }
          : this.userFormAdapter(this.user());
      // Fix selector issue after update the model
      this.form?.controls['user_type'].setValue(this.model.user_type);
      this.cd.detectChanges();
    });
    effect(() => {
      this.disabledChange.emit(this.disabled());
    });
  }
  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
  public create(): void {
    this.handleRequest(
      this.userDataService.create(this.userAdapter(this.model))
    );
  }

  public delete(): void {
    this.handleRequest(
      this.userDataService.delete(this.userAdapter(this.model))
    );
  }

  public save(): void {
    this.handleRequest(
      this.userDataService.update(this.userAdapter(this.model))
    );
  }

  public close(): void {
    if (this.disabled()) {
      return;
    }
    this.closed.emit(false);
  }
  private userAdapter(userForm: UserFormType): User {
    const user: any = { ...userForm };
    delete user['rePassword'];
    return user;
  }

  private userFormAdapter(user: User | null): UserFormType {
    const userForm = { ...this.emptyModel, ...this.user() };
    userForm.rePassword = user?.password || this.emptyModel.rePassword;
    return userForm;
  }

  private handleRequest(req: Observable<boolean>): void {
    this.lockInterface();
    req.subscribe({
      next: (result) => {
        this.unlockInterface();
        this.serverErrorsHandler(null);
        if (result) {
          this.closed.emit(true);
        }
      },
      error: (error) => {
        this.unlockInterface();
        this.serverErrorsHandler(error);
      },
      complete: () => {
        this.unlockInterface();
        this.serverErrorsHandler(null);
      },
    });
  }

  private serverErrorsHandler(errors: ServerValidationErrors | null): void {
    this.serverValidatorService.setErrors(errors);
  }
  private lockInterface(): void {
    this.disabled.set(true);
  }
  private unlockInterface(): void {
    this.disabled.set(false);
  }
}
