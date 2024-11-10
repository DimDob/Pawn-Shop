// pawnShop\src\main\java\com\example\pawnShop\Service\Contract\EmailService.java
package com.example.pawnShop.Service.Contract;

public interface EmailService {
    void sendConfirmationEmail(String to, String token);
} 