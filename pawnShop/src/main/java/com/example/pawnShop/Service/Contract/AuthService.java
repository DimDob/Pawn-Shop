// pawnShop\src\main\java\com\example\pawnShop\Service\Contract\AuthService.java
package com.example.pawnShop.Service.Contract;

import com.example.pawnShop.Dto.Auth.LoginRequestDto;
import com.example.pawnShop.Dto.Auth.LoginResponseDto;
import com.example.pawnShop.Dto.Auth.RegisterRequestDto;
import com.example.pawnShop.Dto.Result;

public interface AuthService {
    public Result<LoginResponseDto> login(LoginRequestDto loginRequestDto);
    public Result<Boolean> register(RegisterRequestDto registerRequestDto);
    public Result<String> refreshToken(String refreshToken);
    public Result<Boolean> logout(String refreshToken);
    public Result<Boolean> confirmEmail(String token);
    public Result<Boolean> forgotPassword(String email);
    public Result<Boolean> resetPassword(String token, String newPassword);
}
