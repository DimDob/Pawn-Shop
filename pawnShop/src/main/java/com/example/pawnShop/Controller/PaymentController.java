package com.example.pawnShop.Controller;

import com.example.pawnShop.Dto.Payment.PaymentIntentDto;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@Slf4j
public class PaymentController {

    @PostMapping("/create-payment-intent")
    public ResponseEntity<Map<String, String>> createPaymentIntent(@RequestBody PaymentIntentDto paymentIntentDto) {
        try {
            Map<String, Object> params = new HashMap<>();
            // Stripe expects amounts in cents
            long amount = paymentIntentDto.getAmount().multiply(new BigDecimal("100")).longValue();
            
            params.put("amount", amount);
            params.put("currency", paymentIntentDto.getCurrency());
            params.put("description", paymentIntentDto.getDescription());
            params.put("automatic_payment_methods", Map.of("enabled", true));

            PaymentIntent paymentIntent = PaymentIntent.create(params);
            
            Map<String, String> response = new HashMap<>();
            response.put("clientSecret", paymentIntent.getClientSecret());

            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            log.error("Error creating payment intent", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
} 