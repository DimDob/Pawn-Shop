// pawnShop\src\main\java\com\example\pawnShop\Service\AuthServiceImp.java
package com.example.pawnShop.Service;

import com.example.pawnShop.Dto.Auth.LoginRequestDto;
import com.example.pawnShop.Dto.Auth.LoginResponseDto;
import com.example.pawnShop.Dto.Auth.RefreshTokenRequestDto;
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
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import java.io.IOException;
import java.security.GeneralSecurityException;
import org.springframework.beans.factory.annotation.Value;
import java.util.Collections;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import jakarta.annotation.PostConstruct;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private String clientId;
    
    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String clientSecret;
    
    @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
    private String redirectUri;

    private GoogleIdTokenVerifier verifier;

    private static final Logger log = LoggerFactory.getLogger(AuthServiceImp.class);

    @PostConstruct
    public void init() {
        try {
            NetHttpTransport transport = new NetHttpTransport();
            JsonFactory jsonFactory = GsonFactory.getDefaultInstance();
            
            verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
                .setAudience(Collections.singletonList(clientId))
                .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize Google token verifier", e);
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


    private LoginResponseDto createLoginResponse(AppUser user) {
        String jwtToken = jwtService.generateJwtToken(user);
        
        return LoginResponseDto.builder()
            .username(user.getEmail())
            .token(jwtToken)
            .isAdmin(user.getRole().equals("ADMIN"))
            .build();
    }

    public Result<Boolean> logout(String refreshToken) {
        try {
            Optional<AppUser> userOptional = userRepository.findByEmail(jwtService.extractSubject(refreshToken));
            if (userOptional.isEmpty()) {
                return Result.error("User not found");
            }
    
            return Result.success(true);
        } catch (Exception e) {
            return Result.error("Failed to logout: " + e.getMessage());
        }
    }

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

    // Google Auth

    @Override
    public Result<Boolean> handleGoogleRegister(String token) {
        System.out.println("Handling Google registration with token: " + token);
        return Result.success(true); // Adjust return value as needed
    }

    private AppUser createGoogleUser(GoogleIdToken.Payload payload) {
        try {
            AppUser user = new AppUser();
            user.setEmail(payload.getEmail());
            user.setFirstName((String) payload.get("given_name"));
            user.setLastName((String) payload.get("family_name"));
            user.setEmailConfirmed(true);
            user.setRole(UserRole.USER);
            user.setEnable(true);
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            
            log.info("Creating new Google user with email: {} and role: {}", 
                payload.getEmail(), UserRole.USER);
            
            return userRepository.save(user);
        } catch (Exception e) {
            log.error("Error creating Google user: {}", e.getMessage());
            throw new RuntimeException("Failed to create Google user", e);
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

    @Override
    public Result<LoginResponseDto> handleGoogleLogin(String token) {
        try {
            log.info("Processing Google login token of length: {}", token.length());
            GoogleIdToken idToken = verifier.verify(token);
            
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                log.info("Google login attempt for email: {}", email);
                
                AppUser user = userRepository.findByEmail(email)
                    .orElseGet(() -> createGoogleUser(payload));

                String jwtToken = jwtService.generateJwtToken(user);
                String refreshToken = jwtService.generateRefreshToken(user);
                
                return Result.success(LoginResponseDto.builder()
                    .username(user.getEmail())
                    .token(jwtToken)
                    .refreshToken(refreshToken)
                    .isAdmin(user.getRole().equals("ADMIN"))
                    .build());
            }
            log.error("Invalid ID token");
            return Result.error("Invalid ID token");
        } catch (Exception e) {
            log.error("Google login failed", e);
            return Result.error(e.getMessage());
        }
    }

    @Override
    public Result<LoginResponseDto> handleGoogleAuthCode(String code) {
        try {
            // Exchange code for tokens
            GoogleTokenResponse tokenResponse = new GoogleAuthorizationCodeTokenRequest(
                new NetHttpTransport(),
                GsonFactory.getDefaultInstance(),
                "https://oauth2.googleapis.com/token",
                clientId,
                clientSecret,
                code,
                redirectUri)
                .execute();

            // Get user info
            GoogleIdToken idToken = tokenResponse.parseIdToken();
            GoogleIdToken.Payload payload = idToken.getPayload();

            String email = payload.getEmail();
            
            // Find or create user
            AppUser user = userRepository.findByEmail(email)
                .orElseGet(() -> createGoogleUser(payload));

            // Generate JWT token
            String jwtToken = jwtService.generateJwtToken(user);
            
            return Result.success(LoginResponseDto.builder()
                .username(user.getEmail())
                .token(jwtToken)
                .isAdmin(user.getRole().equals("ADMIN"))
                .build());
                
        } catch (Exception e) {
            return Result.error("Failed to process Google authentication: " + e.getMessage());
        }
    }
}
