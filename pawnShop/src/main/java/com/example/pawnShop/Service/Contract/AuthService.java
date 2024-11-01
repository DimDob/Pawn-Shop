package com.example.pawnShop.Service.Contract;

import com.example.pawnShop.Dto.Auth.LoginRequestDto;
import com.example.pawnShop.Dto.Auth.LoginResponseDto;
import com.example.pawnShop.Dto.Auth.RegisterRequestDto;
import com.example.pawnShop.Dto.Result;

public interface AuthService {

    Result<LoginResponseDto> login(LoginRequestDto loginRequestDto);

    Result<Boolean> register(RegisterRequestDto registerRequestDto);

}
