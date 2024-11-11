package com.example.pawnShop.Dto.Order;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderItemDto {
    private String productName;
    private Integer quantity;
    private BigDecimal price;
} 