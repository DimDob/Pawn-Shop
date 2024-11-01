package com.example.pawnShop.Validation.PasswordValidator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.regex.Pattern;

public class PasswordConstraintValidator implements ConstraintValidator<ValidPassword, String> {


    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        int minPasswordChars = 6;
        int maxPasswordChars = 18;
        String specialSymbols = "!@#$%^&*_+?";

        final Pattern PASSWORD_PATTERN = Pattern.compile("^(?=.*[A-Z])(?=.*[" + Pattern.quote(specialSymbols) + "]).+$");

        if (password.isEmpty() || password.isBlank()) {
            setMessage(context, "Password cannot be blank.");
            return false;
        }
        if (password.length() < minPasswordChars || password.length() > maxPasswordChars) {
            setMessage(context, String.format("The password must be between %s' and '%s' characters.", minPasswordChars, maxPasswordChars));
            return false;
        }
        if (password.contains(" ")) {
            setMessage(context, "The password cannot contains whitespace.");
            return false;
        }
        if (!PASSWORD_PATTERN.matcher(password).matches()) {
            setMessage(context, String.format("The password must contains at least one upper case character and special symbol('%s').", specialSymbols));
            return false;
        }
        return true;
    }

    private void setMessage(ConstraintValidatorContext context, String message) {
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(message)
                .addConstraintViolation();
    }
}
