package com.example.pawnShop.Dto.Payment;

import lombok.Data;

@Data
public class CheckoutSessionDto {
    private String orderId;
    private Long amount;
    private String currency;
} 