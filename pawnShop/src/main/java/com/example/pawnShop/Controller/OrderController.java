package com.example.pawnShop.Controller;

import com.example.pawnShop.Dto.Order.OrderCreateDto;
import com.example.pawnShop.Dto.Result;
import com.example.pawnShop.Service.Contract.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import org.springframework.security.access.prepost.PreAuthorize;
import com.example.pawnShop.Dto.Order.OrderSummaryDto;
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<Object> createOrder(@RequestBody OrderCreateDto orderDto) {
        System.out.println("Received order creation request");
        Result<OrderCreateDto> result = orderService.createOrder(orderDto);
        
        if (!result.isSuccess()) {
            System.out.println("Failed to create order: " + result.getError());
            return ResponseEntity.badRequest().body(Map.of("error", result.getError()));
        }
        
        System.out.println("Order created successfully");
        return ResponseEntity.ok(Map.of("orderId", result.getValue().getId().toString()));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Object> getAllOrdersForAdmin() {
        System.out.println("Admin requesting all orders");
        Result<List<OrderSummaryDto>> result = orderService.getAllOrdersForAdmin();
        
        if (!result.isSuccess()) {
            System.out.println("Failed to get orders: " + result.getError());
            return ResponseEntity.badRequest().body(Map.of("error", result.getError()));
        }
        
        System.out.println("Successfully returned orders for admin");
        return ResponseEntity.ok(result.getValue());
    }
} 