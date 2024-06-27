package com.example.pawnShop.Factory;

import com.example.pawnShop.Dto.Auth.LoginResponseDto;
import com.example.pawnShop.Dto.Auth.RegisterRequestDto;
import com.example.pawnShop.Entity.User;
import com.example.pawnShop.Factory.Contract.AuthFactory;
import org.springframework.stereotype.Component;

@Component
public class AuthFactoryImp implements AuthFactory {
    @Override
    public LoginResponseDto createLoginResponseDto(User user) {
        return LoginResponseDto.builder()
                .username(user.getEmail())
                //todo add token service and generate token
                .token("some generated token")
                .isAdmin(user.getIsAdmin())
                .build();
    }

    @Override
    public User createUser(RegisterRequestDto registerRequestDto, String encodedPassword) {
        return User.builder()
                .email(registerRequestDto.getEmail())
                .password(encodedPassword)
                .firstName(registerRequestDto.getFirstName())
                .lastName(registerRequestDto.getLastName())
                .build();
    }
}
