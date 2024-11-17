// pawnShop\src\main\java\com\example\pawnShop\Service\Contract\AuthService.java
package com.example.pawnShop.Service.Contract;

import com.example.pawnShop.Dto.Auth.LoginRequestDto;
import com.example.pawnShop.Dto.Auth.LoginResponseDto;
import com.example.pawnShop.Dto.Auth.RegisterRequestDto;
import com.example.pawnShop.Dto.Result;

public interface AuthService {
    Result<LoginResponseDto> login(LoginRequestDto loginRequest);
    Result<LoginResponseDto> handleGoogleLogin(String token);
    Result<Boolean> register(RegisterRequestDto registerRequest);
    Result<Boolean> confirmEmail(String token);
    Result<Boolean> forgotPassword(String email);
    Result<Boolean> resetPassword(String token, String newPassword);
    Result<Boolean> logout(String token);
    Result<String> refreshToken(String refreshToken);
    Result<LoginResponseDto> handleGoogleAuthCode(String code);
    Result<Boolean> handleGoogleRegister(String token);
}
