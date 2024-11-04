package com.example.pawnShop.Service;

import com.example.pawnShop.Dto.Auth.*;
import com.example.pawnShop.Dto.Result;
import com.example.pawnShop.Entity.AppUser;
import com.example.pawnShop.Factory.Contract.AuthFactory;
import com.example.pawnShop.Repository.UserRepository;
import com.example.pawnShop.Service.Contract.AuthService;
import com.example.pawnShop.Service.Contract.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImp implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthFactory authFactory;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    @Override
    public Result<LoginResponseDTO> login(LoginRequestDТО loginRequestDТО) {
        Optional<AppUser> optionalAppUser = this.userRepository.findByEmail(loginRequestDТО.getEmail());
        if (optionalAppUser.isEmpty()) {
            return Result.error("User not found!");
        }
        AppUser user = optionalAppUser.get();
        if (!user.isEnabled()) {
            return Result.error("Account is not verified. Please, check your email!");
        }
        if (!this.passwordEncoder.matches(loginRequestDТО.getPassword(), user.getPassword())) {
            return Result.error("Wrong username or password!");
        }
        this.authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequestDТО.getEmail(),
                        loginRequestDТО.getPassword()
                ));
        return Result.success(this.authFactory.createLoginResponse(user));
    }

    @Override
    public Result<RegisterResponseDTO> register(RegisterRequestDTO registerRequestDTO) {
        if (!registerRequestDTO.getPassword().equals(registerRequestDTO.getConfirmPassword())) {
            return Result.error("Passwords do not match!");
        }
        if (this.userRepository.findByEmail(registerRequestDTO.getEmail()).isPresent()) {
            return Result.error("The email is already in use!");
        }
        AppUser newUser = this.authFactory.createUser(registerRequestDTO);
        sendVerificationEmail(newUser);
        this.userRepository.saveAndFlush(newUser);
        return Result.success(this.authFactory.createRegisterResponse(newUser));
    }

    private void sendVerificationEmail(AppUser newUser) {
        String subject = "Account Verification";
        String htmlMessage =
                "<!DOCTYPE html>" +
                        "<html>" +
                        "<head>" +
                        "<style>" +
                        "body { font-family: Arial, sans-serif; background-color: #f4f4f9; color: #333; }" +
                        ".email-container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; }" +
                        ".header { text-align: center; padding: 10px 0; }" +
                        ".header h1 { color: #4CAF50; }" +
                        ".content { padding: 20px; line-height: 1.6; }" +
                        ".code-container { text-align: center; font-size: 24px; font-weight: bold; padding: 15px; background-color: #f9f9f9; border: 1px dashed #4CAF50; margin-top: 20px; border-radius: 5px; color: #333; }" +
                        ".footer { text-align: center; font-size: 12px; color: #888; padding-top: 20px; }" +
                        "</style>" +
                        "</head>" +
                        "<body>" +
                        "<div class='email-container'>" +
                        "    <div class='header'>" +
                        "        <h1>Welcome to Our Service!</h1>" +
                        "    </div>" +
                        "    <div class='content'>" +
                        "        <p>Hi " + newUser.getUsername() + ",</p>" +
                        "        <p>Thank you for registering with us! Please use the following code to verify your email address:</p>" +
                        "    </div>" +
                        "    <div class='code-container'>" +
                        "        " + newUser.getVerificationCode() +
                        "    </div>" +
                        "    <div class='content'>" +
                        "        <p>If you did not sign up for an account, please ignore this email.</p>" +
                        "    </div>" +
                        "    <div class='footer'>" +
                        "        <p>&copy; 2024 Your Company Name. All rights reserved.</p>" +
                        "    </div>" +
                        "</div>" +
                        "</body>" +
                        "</html>";
        this.emailService.sendVerificationEmail(newUser.getEmail(), subject, htmlMessage);
    }

}
