package com.example.pawnShop.Service.Contract;

import com.example.pawnShop.Dto.Auth.LoginRequestDto;
import com.example.pawnShop.Dto.Auth.LoginResponseDto;
import com.example.pawnShop.Dto.Auth.RegisterRequestDto;

public interface AuthService {
    public LoginResponseDto login(LoginRequestDto loginRequestDto);
    public boolean register(RegisterRequestDto registerRequestDto);
}
