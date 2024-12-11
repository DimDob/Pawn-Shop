// pawnShop\src\main\java\com\example\pawnShop\Controller\AuthController.java
package com.example.pawnShop.Controller;

import com.example.pawnShop.Dto.Auth.LoginRequestDto;
import com.example.pawnShop.Dto.Auth.LoginResponseDto;
import com.example.pawnShop.Dto.Auth.RegisterRequestDto;
import com.example.pawnShop.Dto.Auth.RefreshTokenRequestDto;
import com.example.pawnShop.Dto.Result;
import com.example.pawnShop.Entity.AppUser;
import com.example.pawnShop.Repository.UserRepository;
import com.example.pawnShop.Service.Contract.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.example.pawnShop.Dto.Auth.ForgotPasswordRequestDto;
import com.example.pawnShop.Dto.Auth.GoogleAuthRequestDto;
import com.example.pawnShop.Dto.Auth.ResetPasswordRequestDto;

import org.springframework.stereotype.Service;
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@CrossOrigin(origins = {
    "${allowed.origins}"
}, allowCredentials = "true")
public class AuthController {
    @Value("${frontend.url}")
    private String frontendUrl;

    @Autowired
    private final AuthService authService;
    @Autowired
    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequestDto) {
        Result<LoginResponseDto> result = authService.login(loginRequestDto);
        return result.isSuccess() 
            ? ResponseEntity.ok(result.getData())
            : ResponseEntity.badRequest().body(result.getMessage());
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Validated @RequestBody RegisterRequestDto registerRequestDto){
        Result<Boolean> result = authService.register(registerRequestDto);
        if(!result.isSuccess()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result.getError());
        }
        return ResponseEntity.ok("You are registered! Please check your email for confirmation.");
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequestDto request) {
        Result<LoginResponseDto> result = authService.refreshToken(request.getRefreshToken());
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result.getError());
        }
        return ResponseEntity.ok(result.getValue());
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody RefreshTokenRequestDto request) {
        Result<Boolean> result = authService.logout(request.getRefreshToken());
        
        if (result.isSuccess()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result.getError());
    }

    // Confirm Email
    @PostMapping("/confirm-email")
    public ResponseEntity<?> confirmEmail(@RequestParam String token) {
        AppUser user = userRepository.findByEmailConfirmationToken(token)
            .orElseThrow(() -> new RuntimeException("Invalid token"));
        
        user.setEmailConfirmed(true);
        user.setEmailConfirmationToken(null);
        userRepository.save(user);
        
        return ResponseEntity.ok().build();
    }

    // Forgot Password + Reset Password
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequestDto request) {
        Result<Boolean> result = authService.forgotPassword(request.getEmail());
        if(!result.isSuccess()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result.getError());
        }
        return ResponseEntity.ok("Password reset email sent");
    }
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Validated @RequestBody ResetPasswordRequestDto request) {
        Result<Boolean> result = authService.resetPassword(request.getToken(), request.getNewPassword());
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result.getError());
        }
        return ResponseEntity.ok("Password has been reset successfully");
    }

    // Google Auth

    @PostMapping("/google/login")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleAuthRequestDto request) {
        Result<LoginResponseDto> result = authService.handleGoogleLogin(request.getToken());
        return result.isSuccess()
            ? ResponseEntity.ok(result.getData())
            : ResponseEntity.badRequest().body(result.getMessage());
    }

    @PostMapping("/google/register")
    public ResponseEntity<String> googleRegister(@RequestBody GoogleAuthRequestDto request) {
        authService.handleGoogleRegister(request.getToken());
        return ResponseEntity.ok("Successfully registered with Google");
    }

    @GetMapping("/login/oauth2/code/google")
    public ResponseEntity<?> googleCallback(@RequestParam("code") String code) {
        try {
            Result<LoginResponseDto> result = authService.handleGoogleAuthCode(code);
            return result.isSuccess()
                ? ResponseEntity.ok(result.getData())
                : ResponseEntity.badRequest().body(result.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to process Google authentication");
        }
    }
}


