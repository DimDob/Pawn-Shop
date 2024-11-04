package com.example.pawnShop.Dto.Auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterResponseDTO {

    private String email;

    private Boolean enabled;

    private String verificationCode;

    private LocalDateTime verificationCodeExpiresAt;

}
