package com.example.pawnShop.Controller;

import com.example.pawnShop.Dto.Auth.*;
import com.example.pawnShop.Dto.Result;
import com.example.pawnShop.Service.Contract.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Validated @RequestBody LoginRequestDТО loginRequestDТО) {
        Result<LoginResponseDTO> result = this.authService.login(loginRequestDТО);
        return result.isSuccess() ? ResponseEntity.ok().body(result.getValue()) : ResponseEntity.badRequest().body(result.getError());
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Validated @RequestBody RegisterRequestDTO registerRequestDTO) {
        Result<RegisterResponseDTO> result = this.authService.register(registerRequestDTO);
        return result.isSuccess() ? ResponseEntity.ok().body(result.getValue()) : ResponseEntity.badRequest().body(result.getError());
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@Validated @RequestBody VerificationRequestDTO verificationRequestDTO) {
        Result<VerificationResponseDTO> result = this.authService.verify(verificationRequestDTO);
        return result.isSuccess() ? ResponseEntity.ok().body(result.getValue()) : ResponseEntity.badRequest().body(result.getError());
    }

}
