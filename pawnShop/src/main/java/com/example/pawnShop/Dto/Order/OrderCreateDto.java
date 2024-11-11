package com.example.pawnShop.Dto.Order;

import lombok.Data;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
public class OrderCreateDto {
    private UUID id;
    private ShippingDetailsDto shippingDetails;
    private List<OrderItemDto> items;
    private Double total;
    private Date estimatedDeliveryStart;
    private Date estimatedDeliveryEnd;
}