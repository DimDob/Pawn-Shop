package com.example.pawnShop.Dto.Order;

import lombok.Data;

@Data
public class ShippingDetailsDto {
    private String buyerName;
    private String phone;
    private String streetAddress;
    private String city;
    private String state;
    private String postalCode;
} 