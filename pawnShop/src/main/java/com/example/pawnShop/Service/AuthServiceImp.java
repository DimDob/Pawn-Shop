package com.example.pawnShop.Service;

import com.example.pawnShop.Dto.Auth.LoginRequestDto;
import com.example.pawnShop.Dto.Auth.LoginResponseDto;
import com.example.pawnShop.Dto.Auth.RegisterRequestDto;
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
    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        try {
            if (loginRequestDto == null) {
                return null;
            }
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(), loginRequestDto.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            AppUser user = (AppUser) authentication.getPrincipal();

            return LoginResponseDto.builder()
                    .username(user.getEmail())
                    .token(jwtService.generateJwtToken(user))
                    .isAdmin(user.getIsAdmin())
                    .build();

        } catch (AuthenticationException e){
            return  null;
        }
    }

    @Override
    public boolean register(RegisterRequestDto registerRequestDto) {
        if(registerRequestDto == null){
            return false;
        }
        if(!registerRequestDto.getPassword().equals(registerRequestDto.getConfirmPassword())){
            return false;
        }
        Optional<AppUser> user = userRepository.findByEmail(registerRequestDto.getEmail());

        if(user.isEmpty()){
            String encodedPassword = passwordEncoder.encode(registerRequestDto.getPassword());
            AppUser newUser = authFactory.createUser(registerRequestDto, encodedPassword);

            userRepository.save(newUser);

            return true;
        }

        return false;
    }
}
