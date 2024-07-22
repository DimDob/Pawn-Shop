import { Directive, Input } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from "@angular/forms";
import matchPasswords from "../utils/match-password-validator";

@Directive({
    selector: '[appMatchPasswords]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: MatchPasswordsDirective,
            multi: true
        }
    ]
})

export class MatchPasswordsDirective implements Validator {
    @Input('appMatchPasswords') changedPassword: string | undefined;

    validator: ValidatorFn = () => null;

    validate(control: AbstractControl): ValidationErrors | null {
        this.validator = matchPasswords(this.changedPassword);
        return this.validator(control);
    }
}