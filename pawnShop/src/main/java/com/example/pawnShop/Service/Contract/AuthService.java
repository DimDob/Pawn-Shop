// pawnShop\src\main\java\com\example\pawnShop\Service\Contract\AuthService.java
package com.example.pawnShop.Service.Contract;

import com.example.pawnShop.Dto.Auth.LoginRequestDto;
import com.example.pawnShop.Dto.Auth.LoginResponseDto;
import com.example.pawnShop.Dto.Auth.RegisterRequestDto;
import com.example.pawnShop.Dto.Result;

public interface AuthService {
// sign-in-with-google-endpoint-BE-and-FE
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
//
    public Result<LoginResponseDto> login(LoginRequestDto loginRequestDto);
    public Result<Boolean> register(RegisterRequestDto registerRequestDto);
    public Result<LoginResponseDto> refreshToken(String refreshToken);
    public Result<Boolean> logout(String refreshToken);
    public Result<Boolean> confirmEmail(String token);
    public Result<Boolean> forgotPassword(String email);
    public Result<Boolean> resetPassword(String token, String newPassword);
// google-sign-in-be-fe-1
}
