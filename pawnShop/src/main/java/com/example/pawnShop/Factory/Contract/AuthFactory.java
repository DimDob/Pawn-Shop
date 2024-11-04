package com.example.pawnShop.Factory.Contract;

import com.example.pawnShop.Dto.Auth.RegisterRequestDto;
import com.example.pawnShop.Dto.Auth.RegisterResponseDTO;
import com.example.pawnShop.Entity.AppUser;

public interface AuthFactory {

    AppUser createUser (RegisterRequestDto registerRequestDto);

    RegisterResponseDTO createRegisterResponse(AppUser appUser);

}
