import { Injectable } from '@angular/core';
import {
  ServerValidationErrors,
  ServerValidationProviderInterface,
} from '../validators/user-server-validator/server-validation-token.type';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ServerValidatorService
  implements ServerValidationProviderInterface
{
  private readonly _errors = new BehaviorSubject<ServerValidationErrors | null>(
    null
  );
  get errors$(): Observable<ServerValidationErrors | null> {
    return this._errors.asObservable();
  }
  errors(): ServerValidationErrors {
    return this._errors.value;
  }
  setErrors(errors: ServerValidationErrors | null): void {
    this._errors.next(errors);
  }
}
