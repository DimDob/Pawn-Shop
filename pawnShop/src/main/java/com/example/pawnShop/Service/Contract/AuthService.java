package com.example.pawnShop.Service.Contract;

import com.example.pawnShop.Dto.Auth.*;
import com.example.pawnShop.Dto.Result;

public interface AuthService {

    Result<LoginResponseDTO> login(LoginRequestDТО loginRequestDТО);

    Result<RegisterResponseDTO> register(RegisterRequestDTO registerRequestDTO);

}
