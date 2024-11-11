// pawnShop\src\main\java\com\example\pawnShop\Service\AuthServiceImp.java
package com.example.pawnShop.Service;

import com.example.pawnShop.Dto.Auth.LoginRequestDto;
import com.example.pawnShop.Dto.Auth.LoginResponseDto;
import com.example.pawnShop.Dto.Auth.RegisterRequestDto;
import com.example.pawnShop.Dto.Result;
import com.example.pawnShop.Entity.AppUser;
import com.example.pawnShop.Entity.UserRole;
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
import java.time.LocalDateTime;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import java.io.IOException;
import java.security.GeneralSecurityException;
import org.springframework.beans.factory.annotation.Value;
import java.util.Collections;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import jakarta.annotation.PostConstruct;
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

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    private GoogleIdTokenVerifier verifier;

    @PostConstruct
    public void init() {
        try {
            NetHttpTransport transport = new NetHttpTransport();
            JsonFactory jsonFactory = GsonFactory.getDefaultInstance();
            
            verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
                .setAudience(Collections.singletonList(googleClientId))
                .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize Google token verifier", e);
        }
    }

    private GoogleIdToken verifyGoogleToken(String token) {
        try {
            GoogleIdToken idToken = verifier.verify(token);
            if (idToken == null) {
                throw new RuntimeException("Invalid Google token");
            }
            return idToken;
        } catch (Exception e) {
            throw new RuntimeException("Failed to verify Google token", e);
        }
    }

    private LoginResponseDto createLoginResponse(AppUser user) {
        String jwtToken = jwtService.generateJwtToken(user);
        
        return LoginResponseDto.builder()
            .username(user.getEmail())
            .token(jwtToken)
            .isAdmin(user.getRole().equals("ADMIN"))
            .build();
    }

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
    public LoginResponseDto handleGoogleLogin(String token) {
        GoogleIdToken idToken = verifyGoogleToken(token);
        GoogleIdToken.Payload payload = idToken.getPayload();
        
        String email = payload.getEmail();
        AppUser user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
            
        return createLoginResponse(user);
    }

    @Override
public void handleGoogleRegister(String token) {
    GoogleIdToken idToken = verifyGoogleToken(token);
    GoogleIdToken.Payload payload = idToken.getPayload();
    
    AppUser user = new AppUser();
    user.setEmail(payload.getEmail());
    user.setFirstName((String) payload.get("given_name"));
    user.setLastName((String) payload.get("family_name"));
    user.setEmailConfirmed(true);
    user.setRole(UserRole.USER);
    user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString())); // Generate random password for Google users
    
    userRepository.save(user);
}
}
