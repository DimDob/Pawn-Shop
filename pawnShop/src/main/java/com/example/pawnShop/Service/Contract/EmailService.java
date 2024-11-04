package com.example.pawnShop.Service.Contract;


public interface EmailService {

    void sendVerificationEmail(String to, String subject, String body);

}
