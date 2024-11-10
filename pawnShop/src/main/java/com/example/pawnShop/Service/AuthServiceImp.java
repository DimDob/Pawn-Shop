// pawnShop\src\main\java\com\example\pawnShop\Service\AuthServiceImp.java
package com.example.pawnShop.Service;

import com.example.pawnShop.Dto.Auth.LoginRequestDto;
import com.example.pawnShop.Dto.Auth.LoginResponseDto;
import com.example.pawnShop.Dto.Auth.RegisterRequestDto;
import com.example.pawnShop.Dto.Result;
import com.example.pawnShop.Entity.AppUser;
import com.example.pawnShop.Factory.Contract.AuthFactory;
import com.example.pawnShop.Repository.UserRepository;
import com.example.pawnShop.Service.Contract.AuthService;
import com.example.pawnShop.Service.Contract.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.pawnShop.Service.Contract.JwtService;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImp implements AuthService {

    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final PasswordEncoder passwordEncoder;
    @Autowired
    private final AuthenticationManager authenticationManager;
    @Autowired
    private final JwtService jwtService;
    @Autowired
    private final AuthFactory authFactory;
    @Autowired
    private final EmailService emailService;

    @Override
    public Result<String> refreshToken(String refreshToken) {
        try {
            Optional<AppUser> userOptional = userRepository.findByEmail(jwtService.extractSubject(refreshToken));
            if (userOptional.isEmpty()) {
                return Result.error("User not found");
            }

            AppUser user = userOptional.get();
            String newToken = jwtService.generateJwtToken(user);
            return Result.success(newToken);
        } catch (Exception e) {
            return Result.error("Failed to refresh token");
        }
    }

    @Override
    public Result<Boolean> confirmEmail(String token) {
        try {
            AppUser user = userRepository.findByEmailConfirmationToken(token)
                    .orElseThrow(() -> new RuntimeException("Invalid confirmation token"));

            user.setEmailConfirmed(true);
            user.setEnable(true);
            user.setEmailConfirmationToken(null);
            
            userRepository.save(user);
            
            return Result.success(true);
        } catch (Exception e) {
            return Result.error("Email confirmation failed: " + e.getMessage());
        }
    }

    @Override
    public Result<Boolean> register(RegisterRequestDto registerRequestDto) {
        try {
            if (userRepository.findByEmail(registerRequestDto.getEmail()).isPresent()) {
                return Result.error("Email already exists");
            }

            AppUser user = authFactory.createUser(registerRequestDto, passwordEncoder.encode(registerRequestDto.getPassword()));
            String confirmationToken = UUID.randomUUID().toString();
            user.setEmailConfirmationToken(confirmationToken);
            
            userRepository.save(user);
            
            try {
                emailService.sendConfirmationEmail(user.getEmail(), confirmationToken);
            } catch (Exception e) {
                // Log the error but don't fail registration
                System.out.println("Failed to send confirmation email: " + e.getMessage());
                // Consider adding proper logging here
            }
            
            return Result.success(true);
        } catch (Exception e) {
            return Result.error("Registration failed: " + e.getMessage());
        }
    }

    @Override
    public Result<LoginResponseDto> login(LoginRequestDto loginRequestDto) {
        try {
            Optional<AppUser> userOptional = userRepository.findByEmail(loginRequestDto.getEmail());
            if (userOptional.isEmpty()) {
                return Result.error("Invalid credentials");
            }

            AppUser user = userOptional.get();
            if (!user.isEmailConfirmed()) {
                return Result.error("Please confirm your email first");
            }

            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(), loginRequestDto.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtService.generateJwtToken(user);

            return Result.success(LoginResponseDto.builder()
                .username(user.getEmail())
                .token(jwt)
                .isAdmin(user.getIsAdmin())
                .build());
        } catch (AuthenticationException e) {
            return Result.error("Invalid credentials");
        } catch (Exception e) {
            return Result.error("Login failed: " + e.getMessage());
        }
    }

    @Override
    public Result<Boolean> logout(String refreshToken) {
        try {
            if (!jwtService.isTokenValid(refreshToken)) {
                return Result.error("Invalid token");
            }
            // Тук можете да добавите допълнителна логика за blacklisting на токена
            return Result.success(true);
        } catch (Exception e) {
            return Result.error("Failed to logout");
        }
    }
}
