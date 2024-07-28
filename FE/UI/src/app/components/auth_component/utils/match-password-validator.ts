import { ValidatorFn } from "@angular/forms";

export default function matchPasswords(passwordValue: string | undefined): ValidatorFn {

    return (control) => {
        const isMatch = passwordValue === control.value;
        return isMatch ? null : { matchPasswords: true };
    }
}