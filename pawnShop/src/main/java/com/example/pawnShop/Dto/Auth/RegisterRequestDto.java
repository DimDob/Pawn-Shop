package com.example.pawnShop.Dto.Auth;

import com.example.pawnShop.Entity.Role;
import com.example.pawnShop.Validation.PasswordMatcher.PasswordMatcher;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@PasswordMatcher(password = "password",
                 confirmPassword = "confirmPassword")
public class RegisterRequestDto {

    @NotNull
    @Email
    private String email;

    private String firstName;

    private String lastName;

    @NotNull
    private String password;

    @NotNull
    private String confirmPassword;
}
