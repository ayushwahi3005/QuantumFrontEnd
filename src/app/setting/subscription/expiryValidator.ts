import { AbstractControl, ValidationErrors } from '@angular/forms';

export function expiryValidator(control: AbstractControl): ValidationErrors | null {
  const expiry = control.value;

  if (!expiry || typeof expiry !== 'string') {
    return { invalidExpiry: true };
  }

  const [month, year] = expiry.split('/').map((val) => parseInt(val, 10));

  if (!month || !year || month < 1 || month > 12) {
    return { invalidExpiry: true }; // Invalid month
  }

  const currentYear = new Date().getFullYear() % 100; // Get last two digits of the current year
  const currentMonth = new Date().getMonth() + 1;

  // Check if the year and month are in the future
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return { invalidExpiry: true }; // Expiry is in the past
  }

  return null; // Expiry is valid
}
