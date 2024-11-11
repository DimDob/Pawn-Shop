package com.example.pawnShop.Service.Contract;

import com.example.pawnShop.Dto.Order.OrderSummaryDto;
import com.example.pawnShop.Dto.Result;
import com.example.pawnShop.Entity.enums.OrderStatus;
import java.util.UUID;
public interface OrderService {
    Result<OrderSummaryDto> createOrderSummary(OrderSummaryDto orderSummary);
    Result<OrderSummaryDto> getOrderSummary(UUID orderId);
    Result<OrderSummaryDto> updateOrderStatus(UUID orderId, OrderStatus status);
} 