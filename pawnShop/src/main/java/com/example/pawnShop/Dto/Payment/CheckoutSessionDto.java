package com.example.pawnShop.Dto.Payment;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CheckoutSessionDto {
    private Long amount;
    private String currency;
    private String description;
} 