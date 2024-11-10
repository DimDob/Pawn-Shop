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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST})
public class AuthController {
    @Autowired
    private final AuthService authService;
    @Autowired
    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Validated @RequestBody LoginRequestDto loginRequestDto){
        Result<LoginResponseDto> result = authService.login(loginRequestDto);
        if(!result.isSuccess()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result.getError());
        }
        return ResponseEntity.ok(result.getValue());
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
        Result<String> result = authService.refreshToken(request.getRefreshToken());
        
        if (result.isSuccess()) {
            return ResponseEntity.ok(result.getValue());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result.getError());
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody RefreshTokenRequestDto request) {
        Result<Boolean> result = authService.logout(request.getRefreshToken());
        
        if (result.isSuccess()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result.getError());
    }

    @PostMapping("/confirm-email")
    public ResponseEntity<?> confirmEmail(@RequestParam String token) {
        AppUser user = userRepository.findByEmailConfirmationToken(token)
            .orElseThrow(() -> new RuntimeException("Invalid token"));
        
        user.setEmailConfirmed(true);
        user.setEmailConfirmationToken(null);
        userRepository.save(user);
        
        return ResponseEntity.ok().build();
    }
}