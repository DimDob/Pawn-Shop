// UI\src\app\components\auth_component\utils\match-password-validator.ts
import { ValidatorFn } from "@angular/forms";

export default function matchPasswords(passwordValue: string | undefined): ValidatorFn {
  return control => {
    const isMatch = passwordValue === control.value;
    return isMatch ? null : { matchPasswords: true };
  };
}
