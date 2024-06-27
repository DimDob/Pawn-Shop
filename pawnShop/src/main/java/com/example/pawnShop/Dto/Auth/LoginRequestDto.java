package com.example.pawnShop.Dto.Auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRequestDto {

    @Email
    @NotNull
    private String email;

    @NotNull
    @Min(value = 6, message = "Password should contains minimum of 6 characters")
    @Max(value = 24, message = "Password should contains maximum of 24 characters" )
    private String password;
}
