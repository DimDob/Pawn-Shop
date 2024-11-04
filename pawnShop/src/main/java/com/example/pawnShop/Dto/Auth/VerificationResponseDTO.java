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
public class VerificationResponseDTO {

    private String email;

    private boolean enabled;

    private String verificationCode;

    private LocalDateTime verificationCodeExpiresAt;

}
