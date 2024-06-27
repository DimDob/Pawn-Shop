package com.example.pawnShop.Validation.PasswordMatcher;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.PropertyAccessorFactory;

public class PasswordMatcherValidator implements ConstraintValidator<PasswordMatcher, Object> {
    private String password;
    private String confirmPassword;


    @Override
    public void initialize(PasswordMatcher constraintAnnotation) {
        this.password = constraintAnnotation.password();
        this.confirmPassword = constraintAnnotation.confirmPassword();
    }

    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        BeanWrapper beanWrapper = PropertyAccessorFactory.forBeanPropertyAccess(value);
        Object passwordValue = beanWrapper.getPropertyValue(this.password);
        Object confirmPasswordValue = beanWrapper.getPropertyValue(this.confirmPassword);

        if(passwordValue != null
           && confirmPasswordValue != null
           && this.password.equals(this.confirmPassword)){
            return true;
        }
        return false;
    }
}
