package com.example.pawnShop.Factory;

import com.example.pawnShop.Dto.Auth.RegisterRequestDto;
import com.example.pawnShop.Entity.AppUser;
import com.example.pawnShop.Factory.Contract.AuthFactory;
import org.springframework.stereotype.Component;

@Component
public class AuthFactoryImp implements AuthFactory {

    @Override
    public AppUser createUser(RegisterRequestDto registerRequestDto, String encodedPassword) {
        return AppUser.builder()
                .email(registerRequestDto.getEmail())
                .password(encodedPassword)
                .firstName(registerRequestDto.getFirstName())
                .lastName(registerRequestDto.getLastName())
                .build();
    }
}
