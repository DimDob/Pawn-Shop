package com.example.pawnShop.Controller;

import com.example.pawnShop.Dto.Auth.LoginRequestDto;
import com.example.pawnShop.Dto.Auth.LoginResponseDto;
import com.example.pawnShop.Dto.Auth.RegisterRequestDto;
import com.example.pawnShop.Service.Contract.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequestDto){
        LoginResponseDto login = authService.login(loginRequestDto);

        return ResponseEntity.ok(login);
    }
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequestDto registerRequestDto){
        boolean isRegistered = authService.register(registerRequestDto);
        if(!isRegistered){
            return ResponseEntity.ok("You are NOT registered!!!");
        }
        return ResponseEntity.ok("You are registered!!!");
    }


}
