package com.example.pawnShop.Controller;

import com.example.pawnShop.Dto.Payment.CheckoutSessionDto;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:4200")
@Slf4j
public class PaymentController {

    @Value("${stripe.api.key}")
    private String stripeSecretKey;

    @Value("${frontend.url:http://localhost:4200}")
    private String frontendUrl;

    @PostMapping("/create-checkout-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestBody CheckoutSessionDto checkoutDto) {
        try {
            log.info("Creating checkout session for amount: {}", checkoutDto.getAmount());
            
            Map<String, Object> params = new HashMap<>();
            
            // Настройка на продукта
            Map<String, Object> priceData = new HashMap<>();
            priceData.put("currency", checkoutDto.getCurrency());
            priceData.put("unit_amount", checkoutDto.getAmount());
            
            Map<String, Object> productData = new HashMap<>();
            productData.put("name", "PawnShop Purchase");
            priceData.put("product_data", productData);

            // Настройка на line items
            Map<String, Object> lineItem = new HashMap<>();
            lineItem.put("price_data", priceData);
            lineItem.put("quantity", 1);

            params.put("line_items", Arrays.asList(lineItem));
            params.put("mode", "payment");
            params.put("success_url", frontendUrl + "/success");
            params.put("cancel_url", frontendUrl + "/cart");

            // Създаване на сесията
            Session session = Session.create(params);
            
            Map<String, String> response = new HashMap<>();
            response.put("sessionId", session.getId());
            
            log.info("Checkout session created with ID: {}", session.getId());
            return ResponseEntity.ok(response);

        } catch (StripeException e) {
            log.error("Error creating checkout session", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
} 