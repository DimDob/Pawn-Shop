// Dto/Order/OrderItemDto.java
package com.example.pawnShop.Dto.Order;

import lombok.Data;
import java.util.UUID;

@Data
public class OrderItemDto {
    private UUID productId;
    private Integer quantity;
    private Double price;
    private Double totalPrice;
} 