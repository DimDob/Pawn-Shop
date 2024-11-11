package com.example.pawnShop.Service;

import com.example.pawnShop.Dto.Order.OrderSummaryDto;
import com.example.pawnShop.Dto.Result;
import com.example.pawnShop.Entity.Order;
import com.example.pawnShop.Entity.OrderItem;
import com.example.pawnShop.Entity.enums.OrderStatus;
import com.example.pawnShop.Repository.OrderRepository;
import com.example.pawnShop.Service.Contract.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;
import java.util.Optional;
import com.example.pawnShop.Dto.Order.ShippingDetailsDto;
import com.example.pawnShop.Repository.UserRepository;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Result<OrderSummaryDto> createOrderSummary(OrderSummaryDto orderSummary) {
        try {
            System.out.println("Creating order summary");
            
            var authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                System.out.println("User not authenticated");
                return Result.error("User not authenticated");
            }

            String userEmail = authentication.getName();
            var user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            System.out.println("Creating order for user: " + userEmail);

            Order order = Order.builder()
                .user(user)
                .buyerName(orderSummary.getShippingDetails().getBuyerName())
                .buyerPhone(orderSummary.getShippingDetails().getPhone())
                .shippingAddress(orderSummary.getShippingDetails().getStreetAddress())
                .shippingCity(orderSummary.getShippingDetails().getCity())
                .shippingState(orderSummary.getShippingDetails().getState())
                .shippingPostalCode(orderSummary.getShippingDetails().getPostalCode())
                .total(orderSummary.getTotal())
                .estimatedDeliveryStart(orderSummary.getEstimatedDeliveryStart())
                .estimatedDeliveryEnd(orderSummary.getEstimatedDeliveryEnd())
                .status(OrderStatus.PENDING)
                .build();

            Order savedOrder = orderRepository.save(order);
            System.out.println("Order saved successfully with ID: " + savedOrder.getId());

            return Result.success(orderSummary);
        } catch (Exception e) {
            System.out.println("Error creating order: " + e.getMessage());
            return Result.error("Failed to create order: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Result<OrderSummaryDto> getOrderSummary(UUID orderId) {
        try {
            System.out.println("Getting order summary for ID: " + orderId);
            
            Optional<Order> orderOpt = orderRepository.findById(orderId);
            if (orderOpt.isEmpty()) {
                System.out.println("Order not found with ID: " + orderId);
                return Result.error("Order not found");
            }

            Order order = orderOpt.get();
            OrderSummaryDto summaryDto = mapOrderToSummaryDto(order);
            
            System.out.println("Successfully retrieved order summary");
            return Result.success(summaryDto);
        } catch (Exception e) {
            System.out.println("Error getting order summary: " + e.getMessage());
            return Result.error("Failed to get order summary: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public Result<OrderSummaryDto> updateOrderStatus(UUID orderId, OrderStatus status) {
        try {
            System.out.println("Updating order status. ID: " + orderId + ", New status: " + status);
            
            Optional<Order> orderOpt = orderRepository.findById(orderId);
            if (orderOpt.isEmpty()) {
                System.out.println("Order not found with ID: " + orderId);
                return Result.error("Order not found");
            }

            Order order = orderOpt.get();
            order.setStatus(status);
            Order updatedOrder = orderRepository.save(order);
            
            OrderSummaryDto summaryDto = mapOrderToSummaryDto(updatedOrder);
            System.out.println("Successfully updated order status");
            return Result.success(summaryDto);
        } catch (Exception e) {
            System.out.println("Error updating order status: " + e.getMessage());
            return Result.error("Failed to update order status: " + e.getMessage());
        }
    }

    private OrderSummaryDto mapOrderToSummaryDto(Order order) {
        OrderSummaryDto dto = new OrderSummaryDto();
        // Map shipping details
        ShippingDetailsDto shippingDetails = new ShippingDetailsDto();
        shippingDetails.setBuyerName(order.getBuyerName());
        shippingDetails.setPhone(order.getBuyerPhone());
        shippingDetails.setStreetAddress(order.getShippingAddress());
        shippingDetails.setCity(order.getShippingCity());
        shippingDetails.setState(order.getShippingState());
        shippingDetails.setPostalCode(order.getShippingPostalCode());
        
        dto.setShippingDetails(shippingDetails);
        dto.setTotal(order.getTotal());
        dto.setEstimatedDeliveryStart(order.getEstimatedDeliveryStart());
        dto.setEstimatedDeliveryEnd(order.getEstimatedDeliveryEnd());
        
        // Map order items if needed
        // This would require additional repository calls and mapping
        
        return dto;
    }
} 