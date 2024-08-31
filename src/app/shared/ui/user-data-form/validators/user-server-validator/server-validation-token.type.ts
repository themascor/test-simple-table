import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
export type ServerValidationErrors = { [filedId in string]: string[] } | null;

export interface ServerValidationProviderInterface {
  readonly errors$: Observable<ServerValidationErrors | null>;
  errors(): ServerValidationErrors | null;
  setErrors(errors: ServerValidationErrors | null): void;
}

export const SERVER_VALIDATION_TOKEN =
  new InjectionToken<ServerValidationProviderInterface>(
    'SERVER_VALIDATION_TOKEN'
  );
