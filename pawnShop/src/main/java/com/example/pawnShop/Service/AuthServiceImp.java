// pawnShop\src\main\java\com\example\pawnShop\Service\AuthServiceImp.java
package com.example.pawnShop.Service;

import com.example.pawnShop.Dto.Auth.LoginRequestDto;
import com.example.pawnShop.Dto.Auth.LoginResponseDto;
import com.example.pawnShop.Dto.Auth.RefreshTokenRequestDto;
import com.example.pawnShop.Dto.Auth.RegisterRequestDto;
import com.example.pawnShop.Dto.Result;
import com.example.pawnShop.Entity.AppUser;
import com.example.pawnShop.Factory.Contract.AuthFactory;
import com.example.pawnShop.Repository.UserRepository;
import com.example.pawnShop.Service.Contract.AuthService;
import com.example.pawnShop.Service.Contract.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.pawnShop.Service.Contract.JwtService;
import java.util.Optional;
import java.util.UUID;
import java.time.LocalDateTime;

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
    public Result<LoginResponseDto> refreshToken(String refreshToken) {
        try {
            if (!jwtService.isTokenValid(refreshToken)) {
                return Result.error("Refresh token is expired or invalid");
            }
    
            String userEmail = jwtService.extractSubject(refreshToken);
            Optional<AppUser> userOptional = userRepository.findByEmail(userEmail);
            
            if (userOptional.isEmpty()) {
                return Result.error("User not found");
            }
    
            AppUser user = userOptional.get();
            String newToken = jwtService.generateJwtToken(user);
            
            return Result.success(LoginResponseDto.builder()
                    .username(user.getEmail())
                    .token(newToken)
                    .isAdmin(user.getIsAdmin())
                    .build());
        } catch (Exception e) {
            return Result.error("Failed to refresh token: " + e.getMessage());
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
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequestDto.getEmail(),
                    loginRequestDto.getPassword()
                )
            );
    
            AppUser user = (AppUser) authentication.getPrincipal();
            String jwtToken = jwtService.generateJwtToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);
    
            LoginResponseDto response = LoginResponseDto.builder()
                .username(user.getEmail())
                .token(jwtToken)
                .refreshToken(refreshToken)
                .isAdmin(user.getIsAdmin())
                .build();
    
            return Result.success(response);
        } catch (AuthenticationException e) {
            return Result.error("Invalid credentials");
        }
    }

    @Override
    public Result<Boolean> forgotPassword(String email) {
        try {
            Optional<AppUser> userOptional = userRepository.findByEmail(email);
            if (userOptional.isEmpty()) {
                return Result.error("User not found");
            }

            AppUser user = userOptional.get();
            String resetToken = UUID.randomUUID().toString();
            user.setPasswordResetToken(resetToken);
            user.setPasswordResetTokenExpiry(LocalDateTime.now().plusHours(24));
            userRepository.save(user);

            emailService.sendPasswordResetEmail(email, resetToken);
            return Result.success(true);
        } catch (Exception e) {
            return Result.error("Failed to process forgot password request: " + e.getMessage());
        }
    }

    @Override
    public Result<Boolean> resetPassword(String token, String newPassword) {
        try {
            Optional<AppUser> userOptional = userRepository.findByPasswordResetToken(token);
            if (userOptional.isEmpty()) {
                return Result.error("Invalid reset token");
            }

            AppUser user = userOptional.get();
            if (user.getPasswordResetTokenExpiry().isBefore(LocalDateTime.now())) {
                return Result.error("Reset token has expired");
            }

            user.setPassword(passwordEncoder.encode(newPassword));
            user.setPasswordResetToken(null);
            user.setPasswordResetTokenExpiry(null);
            userRepository.save(user);

            return Result.success(true);
        } catch (Exception e) {
            return Result.error("Failed to reset password: " + e.getMessage());
        }
    }

    @Override
    public Result<Boolean> logout(String refreshToken) {
        try {
            Optional<AppUser> userOptional = userRepository.findByEmail(jwtService.extractSubject(refreshToken));
            if (userOptional.isEmpty()) {
                return Result.error("User not found");
            }
            
            // Тук можете да добавите допълнителна логика за logout,
            // например инвалидиране на токена или записване в blacklist
            
            return Result.success(true);
        } catch (Exception e) {
            return Result.error("Failed to logout: " + e.getMessage());
        }
    }
}
