package com.example.pawnShop.Factory;

import com.example.pawnShop.Dto.Auth.RegisterRequestDto;
import com.example.pawnShop.Dto.Auth.RegisterResponseDTO;
import com.example.pawnShop.Entity.AppUser;
import com.example.pawnShop.Entity.Role;
import com.example.pawnShop.Factory.Contract.AuthFactory;
import com.example.pawnShop.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
public class AuthFactoryImp implements AuthFactory {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AppUser createUser(RegisterRequestDto registerRequestDto) {
        return AppUser.builder()
                .email(registerRequestDto.getEmail())
                .password(this.passwordEncoder.encode(registerRequestDto.getPassword()))
                .firstName(registerRequestDto.getFirstName())
                .lastName(registerRequestDto.getLastName())
                .enabled(false)
                .verificationCode(generateVerificationCode())
                .verificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15))
                .roles(List.of(this.userRepository.count() == 0 ? Role.ROLE_ADMIN : Role.ROLE_USER))
                .build();
    }

    @Override
    public RegisterResponseDTO createRegisterResponse(AppUser appUser) {
        return RegisterResponseDTO.builder()
                .email(appUser.getEmail())
                .enabled(appUser.getEnabled())
                .verificationCode(appUser.getVerificationCode())
                .verificationCodeExpiresAt(appUser.getVerificationCodeExpiresAt())
                .build();
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }

}
