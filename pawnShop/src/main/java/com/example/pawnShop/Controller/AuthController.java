package com.example.pawnShop.Controller;

import com.example.pawnShop.Dto.Auth.LoginRequestDto;
import com.example.pawnShop.Dto.Auth.LoginResponseDto;
import com.example.pawnShop.Dto.Auth.RegisterRequestDto;
import com.example.pawnShop.Dto.Auth.RegisterResponseDTO;
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
    public ResponseEntity<?> login(@Validated @RequestBody LoginRequestDto loginRequestDto) {
        Result<LoginResponseDto> result = this.authService.login(loginRequestDto);
        return result.isSuccess() ? ResponseEntity.ok().body(result.getValue()) : ResponseEntity.badRequest().body(result.getError());
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Validated @RequestBody RegisterRequestDto registerRequestDto) {
        Result<RegisterResponseDTO> result = this.authService.register(registerRequestDto);
        return result.isSuccess() ? ResponseEntity.ok().body(result.getValue()) : ResponseEntity.badRequest().body(result.getError());
    }

}
