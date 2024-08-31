import { Pipe, type PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Pipe({
  name: 'appValidationMessages',
  pure: true,
  standalone: true,
})
export class ValidationMessagesPipe implements PipeTransform {
  // Also we can provide default messages from outside but for current use case its enough
  private readonly defaultMessages: { [errorKey in string]: string } = {
    required: 'The field is mandatory',
    email: 'Invalid email',
  };

  transform(errors: ValidationErrors | null, ...args: unknown[]): string {
    if (!errors) {
      return '';
    }
    const messages: string[] = [];
    for (const errorKey in errors) {
      if (Object.prototype.hasOwnProperty.call(errors, errorKey)) {
        const errorMessages = errors[errorKey];
        const arrayOfMessages = Array.isArray(errorMessages)
          ? errorMessages
          : [this.defaultMessages[errorKey] || errorKey];
        messages.push(...arrayOfMessages);
      }
    }
    return messages.join('\n');
  }
}
