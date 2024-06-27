package com.example.pawnShop.Factory.Contract;

import com.example.pawnShop.Dto.Auth.LoginResponseDto;
import com.example.pawnShop.Dto.Auth.RegisterRequestDto;
import com.example.pawnShop.Entity.User;

public interface AuthFactory {
    public LoginResponseDto createLoginResponseDto(User user);
    public User createUser (RegisterRequestDto registerRequestDto, String encodedPassword);
}
