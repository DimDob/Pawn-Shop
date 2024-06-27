package com.example.pawnShop.Service;

import com.example.pawnShop.Dto.Auth.LoginRequestDto;
import com.example.pawnShop.Dto.Auth.LoginResponseDto;
import com.example.pawnShop.Dto.Auth.RegisterRequestDto;
import com.example.pawnShop.Entity.User;
import com.example.pawnShop.Factory.Contract.AuthFactory;
import com.example.pawnShop.Repository.UserRepository;
import com.example.pawnShop.Service.Contract.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImp implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthFactory authFactory;

    @Override
    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        if(loginRequestDto == null){
            return null;
        }
        User user = userRepository.findByEmail(loginRequestDto.getEmail()).orElse(null);
        if(user == null){
            return null;
        }

        if(passwordEncoder.matches(loginRequestDto.getPassword(), user.getPassword())){
            return null;
        }

        return authFactory.createLoginResponseDto(user);
    }

    @Override
    public boolean register(RegisterRequestDto registerRequestDto) {
        if(registerRequestDto == null){
            return false;
        }
        Optional<User> user = userRepository.findByEmail(registerRequestDto.getEmail());

        if(user.isPresent()){
            String encodedPassword = passwordEncoder.encode(registerRequestDto.getPassword());
            User newUser = authFactory.createUser(registerRequestDto, encodedPassword);

            userRepository.save(newUser);

            return true;
        }

        return false;
    }
}
