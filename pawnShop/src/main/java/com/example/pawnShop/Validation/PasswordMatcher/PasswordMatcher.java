package com.example.pawnShop.Validation.PasswordMatcher;

import jakarta.validation.Constraint;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Constraint(validatedBy = PasswordMatcherValidator.class)
public @interface PasswordMatcher {
    public String password();
    public String confirmPassword();
}
