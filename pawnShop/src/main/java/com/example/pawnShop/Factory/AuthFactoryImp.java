// pawnShop\src\main\java\com\example\pawnShop\Factory\AuthFactoryImp.java
package com.example.pawnShop.Factory;

import com.example.pawnShop.Dto.Auth.LoginResponseDto;
import com.example.pawnShop.Dto.Auth.RegisterRequestDto;
import com.example.pawnShop.Entity.AppUser;
import com.example.pawnShop.Factory.Contract.AuthFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AuthFactoryImp implements AuthFactory {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public AppUser  createUser(RegisterRequestDto dto, String encodedPassword) {
        return AppUser.builder()
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .enable(true)
                .isAdmin(false)
                .emailConfirmed(false)
                .emailVerified(false)
                .build();
    }
}
