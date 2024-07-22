package com.example.pawnShop.Service;

import com.example.pawnShop.Entity.AppUser;
import com.example.pawnShop.Exception.UserNoTFoundException;
import com.example.pawnShop.Repository.UserRepository;
import com.example.pawnShop.Service.Contract.EmailService;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class EmailServiceImpl implements EmailService {

    private UserRepository userRepository;
    private JavaMailSender javaMailSender;


    public EmailServiceImpl(UserRepository userRepository, JavaMailSender javaMailSender) {
        this.userRepository = userRepository;
        this.javaMailSender = javaMailSender;
    }

    @Override
    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        Optional<AppUser> optionalAppUser = userRepository.findByEmail(toEmail);
        if(optionalAppUser.isEmpty()) {
            throw new UserNoTFoundException("User with email " + toEmail + " not found");
        }
        AppUser user = optionalAppUser.get();
        String firstName = user.getFirstName();
        String subject = "Reset your password";
        String body = String.format(
                "Hi %s,\n\n" +
                        "We received a request to reset the password for your account.\n\n" +
                        "To reset your password, click the link below:\n\n" +
                        "%s\n\n" +
                        "If you did not request a password reset, please ignore this email or contact our support team if you have any questions.\n\n" +
                        "Thank you,\n" +
                        "The Team",
                firstName, resetLink
        );

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom(System.getenv("GMAIL_USERNAME"));

        javaMailSender.send(message);

    }
}
