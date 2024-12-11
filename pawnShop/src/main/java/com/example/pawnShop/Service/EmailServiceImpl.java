// pawnShop\src\main\java\com\example\pawnShop\Service\EmailServiceImpl.java
package com.example.pawnShop.Service;

import com.example.pawnShop.Service.Contract.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender mailSender;

    @Override
    public void sendConfirmationEmail(String to, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setTo(to);
            helper.setSubject("Confirm your account");
            
            String confirmationUrl = "https://pawnshop17.vercel.app/auth/confirm-email?token=" + token;
            String emailContent = String.format(
                "<h3>Welcome to our website!</h3>" +
                "<p>Please click on the link below to confirm your email address:</p>" +
                "<a href='%s'>Confirm email</a>", 
                confirmationUrl
            );
            
            helper.setText(emailContent, true);
            mailSender.send(message);
            
        } catch (MessagingException e) {
            throw new RuntimeException("Error sending email", e);
        }
    }

    @Override
    public void sendPasswordResetEmail(String to, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setTo(to);
            helper.setSubject("Reset your password");
            
            String resetUrl = "https://pawnshop17.vercel.app/auth/reset-password?token=" + token;
            String emailContent = String.format(
                "<h3>Password Reset Request</h3>" +
                "<p>Click the link below to reset your password:</p>" +
                "<a href='%s'>Reset password</a>" +
                "<p>This link will expire in 24 hours.</p>", 
                resetUrl
            );
            
            helper.setText(emailContent, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Error sending password reset email", e);
        }
    }
} 