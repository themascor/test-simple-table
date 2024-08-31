import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Directive({
  selector: '[appMatchValueValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MatchValueValidatorDirective,
      multi: true,
    },
  ],
  standalone: true,
})
export class MatchValueValidatorDirective implements Validator {
  private msg = 'Passwords do not match.';
  private etalonValue = '';
  @Input('appMatchValueValidator')
  set matchValue(value: string) {
    this.etalonValue = value;
    this.onValidatorChange && this.onValidatorChange();
  }
  get matchValue(): string {
    return this.etalonValue;
  }
  @Input('appMatchValueValidatorError')
  set message(msg: string) {
    this.msg = msg;
    this.onValidatorChange && this.onValidatorChange();
  }
  get message(): string {
    return this.msg;
  }
  private onValidatorChange!: () => void;
  validate(control: AbstractControl): ValidationErrors | null {
    return control.value === this.matchValue
      ? null
      : { matchValueValidator: [this.message] };
  }
  registerOnValidatorChange?(fn: () => void): void {
    this.onValidatorChange = fn;
  }
}
