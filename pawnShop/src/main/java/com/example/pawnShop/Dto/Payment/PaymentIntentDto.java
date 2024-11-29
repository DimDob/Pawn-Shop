// Dto/Payment/PaymentIntentDto.java
package com.example.pawnShop.Dto.Payment;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PaymentIntentDto {
    private BigDecimal amount;
    private String currency;
    private String description;
} 