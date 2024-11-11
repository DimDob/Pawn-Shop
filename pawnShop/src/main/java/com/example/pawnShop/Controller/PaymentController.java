package com.example.pawnShop.Controller;

import com.example.pawnShop.Dto.Payment.CheckoutSessionDto;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.StripeObject;
import com.stripe.net.Webhook;
import com.example.pawnShop.Service.Contract.OrderService;
import com.example.pawnShop.Entity.enums.OrderStatus;
import lombok.RequiredArgsConstructor;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

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

    @Value("${stripe.webhook.secret}")
    private String endpointSecret;

    @PostMapping("/create-checkout-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestBody CheckoutSessionDto checkoutDto) {
        try {
            log.info("Creating checkout session for amount: {}", checkoutDto.getAmount());
            
            Map<String, Object> params = new HashMap<>();
            
            // Product setup
            Map<String, Object> priceData = new HashMap<>();
            priceData.put("currency", checkoutDto.getCurrency());
            priceData.put("unit_amount", checkoutDto.getAmount());
            
            Map<String, Object> productData = new HashMap<>();
            productData.put("name", "PawnShop Purchase");
            priceData.put("product_data", productData);

            // Line items setup
            Map<String, Object> lineItem = new HashMap<>();
            lineItem.put("price_data", priceData);
            lineItem.put("quantity", 1);

            params.put("line_items", Arrays.asList(lineItem));
            params.put("mode", "payment");
            params.put("success_url", frontendUrl + "/success");
            params.put("cancel_url", frontendUrl + "/cart");

            // Creating the session
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

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
        log.info("Received Stripe webhook");
        
        try {
            Event event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
            
            // Handle the event
            switch (event.getType()) {
                case "checkout.session.completed":
                    log.info("Payment successful!");
                    EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
                    if (dataObjectDeserializer.getObject().isPresent()) {
                        Session session = (Session) dataObjectDeserializer.getObject().get();
                        // Update order status to PAID
                        orderService.updateOrderStatus(UUID.fromString(session.getClientReferenceId()), OrderStatus.PAID);
                    }
                    break;
                    
                case "checkout.session.expired":
                    log.warn("Checkout session expired");
                    break;
                    
                default:
                    log.info("Unhandled event type: {}", event.getType());
            }

            return ResponseEntity.ok().body("Webhook processed successfully");
        } catch (Exception e) {
            log.error("Error processing webhook", e);
            return ResponseEntity.badRequest().body("Webhook error: " + e.getMessage());
        }
    }
} 