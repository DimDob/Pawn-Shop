package com.example.pawnShop.Dto.Product;

import lombok.*;

import java.util.UUID;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ProductTypeDto {
    private UUID id;
    private String name;
}