package com.example.pawnShop.Service.Contract;

public interface EmailService {

    void sendPasswordResetEmail(String toEmail, String resetLink);
}
