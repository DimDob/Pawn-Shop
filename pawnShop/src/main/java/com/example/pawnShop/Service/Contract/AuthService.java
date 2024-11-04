package com.example.pawnShop.Service.Contract;

import com.example.pawnShop.Dto.Auth.*;
import com.example.pawnShop.Dto.Result;

public interface AuthService {

    Result<LoginResponseDto> login(LoginRequestDto loginRequestDto);

    Result<RegisterResponseDTO> register(RegisterRequestDto registerRequestDto);

}
