package com.example.pawnShop.Service.Contract;

import com.example.pawnShop.Dto.Order.OrderSummaryDto;
import com.example.pawnShop.Dto.Result;
import com.example.pawnShop.Entity.enums.OrderStatus;
import java.util.UUID;
import com.example.pawnShop.Dto.Order.OrderCreateDto;
import com.example.pawnShop.Dto.Payment.CheckoutSessionDto;
import java.util.List;

public interface OrderService {
    Result<OrderSummaryDto> createOrderSummary(OrderSummaryDto orderSummary);
    Result<OrderSummaryDto> getOrderSummary(UUID orderId);
    Result<OrderSummaryDto> updateOrderStatus(UUID orderId, OrderStatus status);
    Result<OrderCreateDto> createOrder(OrderCreateDto orderDto);
    Result<CheckoutSessionDto> createCheckoutSession(CheckoutSessionDto checkoutDto);
    Result<List<OrderSummaryDto>> getAllOrdersForAdmin();
} 