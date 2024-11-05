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
import com.example.pawnShop.Service.Contract.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImp implements AuthService {

    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final PasswordEncoder passwordEncoder;
    @Autowired
    private final AuthFactory authFactory;
    @Autowired
    private final AuthenticationManager authenticationManager;
    @Autowired
    private final JwtService jwtService;

    @Override
    public Result<LoginResponseDto> login(LoginRequestDto loginRequestDto) {
        try {
            if (loginRequestDto == null) {
                return Result.error("The fields are empty.");
            }
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(), loginRequestDto.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            AppUser user = (AppUser) authentication.getPrincipal();

            return Result.success(LoginResponseDto.builder()
                    .username(user.getEmail())
                    .token(jwtService.generateJwtToken(user))
                    .isAdmin(user.getIsAdmin())
                    .build());

        } catch (AuthenticationException e){

            return  Result.error("Incorrect email or password.");
        }
    }

    @Override
    public Result<Boolean> register(RegisterRequestDto registerRequestDto) {
        try {
            if (registerRequestDto == null) {
                return Result.error("The fields are empty.");
            }
            if (!registerRequestDto.getPassword().equals(registerRequestDto.getConfirmPassword())) {
                return Result.error("Password and confirmed password do not match.");
            }
            Optional<AppUser> user = userRepository.findByEmail(registerRequestDto.getEmail());

            if (!user.isEmpty()) {
                return Result.error("There is a user with this email.");
            }
            String encodedPassword = passwordEncoder.encode(registerRequestDto.getPassword());
            AppUser newUser = authFactory.createUser(registerRequestDto, encodedPassword);

            userRepository.save(newUser);

            return Result.success(true);

        } catch(Exception e){

            return Result.error("You can not register this user.");
        }
    }
}
