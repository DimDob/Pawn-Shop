package com.example.pawnShop.Controller;

import com.example.pawnShop.Dto.Order.OrderSummaryDto;
import com.example.pawnShop.Dto.Result;
import com.example.pawnShop.Service.Contract.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/create-summary")
    public ResponseEntity<?> createOrderSummary(@RequestBody OrderSummaryDto orderSummary) {
        System.out.println("Received order summary request");
        Result<OrderSummaryDto> result = orderService.createOrderSummary(orderSummary);
        
        if (!result.isSuccess()) {
            System.out.println("Failed to create order: " + result.getError());
            return ResponseEntity.badRequest().body(result.getError());
        }
        
        System.out.println("Order created successfully");
        return ResponseEntity.ok(result.getValue());
    }
} 