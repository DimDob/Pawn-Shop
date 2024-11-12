package com.example.pawnShop.Controller;

import com.example.pawnShop.Dto.Payment.CheckoutSessionDto;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import com.example.pawnShop.Service.Contract.OrderService;
import com.example.pawnShop.Entity.enums.OrderStatus;
import java.util.UUID;
import com.example.pawnShop.Dto.Result;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:4200")
@Slf4j
@RequiredArgsConstructor
public class PaymentController {

    private final OrderService orderService;

    @Value("${stripe.api.key}")
    private String stripeSecretKey;

    @Value("${frontend.url:http://localhost:4200}")
    private String frontendUrl;

    @PostMapping("/create-checkout-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestBody CheckoutSessionDto checkoutDto) {
        try {
            log.info("Creating checkout session for amount: {}", checkoutDto.getAmount());
            
            // Create checkout session
            Result<CheckoutSessionDto> result = orderService.createCheckoutSession(checkoutDto);
            
            if (!result.isSuccess()) {
                return ResponseEntity.badRequest().body(Map.of("error", result.getError().getMessage()));
            }
            
            // Create Stripe session
            Map<String, Object> params = new HashMap<>();
            Map<String, Object> priceData = new HashMap<>();
            priceData.put("currency", checkoutDto.getCurrency());
            priceData.put("unit_amount", checkoutDto.getAmount());
            
            Map<String, Object> productData = new HashMap<>();
            productData.put("name", "PawnShop Purchase");
            priceData.put("product_data", productData);

            Map<String, Object> lineItem = new HashMap<>();
            lineItem.put("price_data", priceData);
            lineItem.put("quantity", 1);

            params.put("line_items", Arrays.asList(lineItem));
            params.put("mode", "payment");
            params.put("success_url", frontendUrl + "/success?orderId=" + checkoutDto.getOrderId());
            params.put("cancel_url", frontendUrl + "/cart");

            Session session = Session.create(params);
            
            // Update order status to processing
            orderService.updateOrderStatus(UUID.fromString(checkoutDto.getOrderId()), OrderStatus.PROCESSING);
            
            Map<String, String> response = new HashMap<>();
            response.put("sessionId", session.getId());
            
            log.info("Checkout session created with ID: {}", session.getId());
            return ResponseEntity.ok(response);

        } catch (StripeException e) {
            log.error("Error creating checkout session", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/confirm-payment/{orderId}")
    public ResponseEntity<Map<String, String>> confirmPayment(@PathVariable UUID orderId) {
        try {
            orderService.updateOrderStatus(orderId, OrderStatus.PAID);
            return ResponseEntity.ok(Map.of("status", "Payment confirmed"));
        } catch (Exception e) {
            log.error("Error confirming payment", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
} 