import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Directive({
  selector: '[appStrongPasswordValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: StrongPasswordValidatorDirective,
      multi: true,
    },
  ],
  standalone: true,
})
export class StrongPasswordValidatorDirective implements Validator {
  private readonly minLength = 8;
  // contains letter and number
  private pattern = /^(?=.*[A-Za-z])(?=.*\d).+$/;
  validate(control: AbstractControl): ValidationErrors | null {
    const pwd = control.value;
    const messages: string[] = [];
    !this.checkLength(pwd) && messages.push(`Password is not long enough (${this.minLength} characters minimum)`);
    !this.checkContent(pwd) &&
      messages.push(
        'Password should contain at least one number and one letter'
      );
    return messages.length > 0 ? { StrongPasswordValidator: messages } : null;
  }
  // registerOnValidatorChange?(fn: () => void): void {
  //   throw new Error('Method not implemented.');
  // }

  private checkLength(pwd: string | null, minLength = this.minLength): boolean {
    return pwd === null ? false : pwd.length >= minLength;
  }

  private checkContent(pwd: string | null, pattern = this.pattern): boolean {
    return pwd === null ? false : pattern.test(pwd);
  }
}
