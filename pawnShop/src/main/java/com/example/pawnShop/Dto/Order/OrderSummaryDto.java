package com.example.pawnShop.Dto.Order;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class OrderSummaryDto {
    private ShippingDetailsDto shippingDetails;
    private List<OrderItemDto> items;
    private BigDecimal total;
    private LocalDate estimatedDeliveryStart;
    private LocalDate estimatedDeliveryEnd;
} 