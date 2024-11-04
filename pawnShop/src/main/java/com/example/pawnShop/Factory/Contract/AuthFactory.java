package com.example.pawnShop.Factory.Contract;

import com.example.pawnShop.Dto.Auth.LoginResponseDTO;
import com.example.pawnShop.Dto.Auth.RegisterRequestDTO;
import com.example.pawnShop.Dto.Auth.RegisterResponseDTO;
import com.example.pawnShop.Entity.AppUser;

public interface AuthFactory {

    AppUser createUser (RegisterRequestDTO registerRequestDto);

    RegisterResponseDTO createRegisterResponse(AppUser appUser);

    LoginResponseDTO createLoginResponse(AppUser appUser);

}
