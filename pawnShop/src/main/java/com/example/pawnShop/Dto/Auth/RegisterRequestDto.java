package com.example.pawnShop.Dto.Auth;

import com.example.pawnShop.Validation.PasswordValidator.ValidPassword;
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
public class RegisterRequestDto {

    @NotNull
    @Email
    private String email;

    private String firstName;

    private String lastName;

    @NotNull
    @ValidPassword
    private String password;

    @NotNull
    private String confirmPassword;
}
