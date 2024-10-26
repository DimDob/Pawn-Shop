package com.example.pawnShop.Dto.Product;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ProductTypeDto {
    private Long id;
    private String name;
}
