// pawnShop\src\main\java\com\example\pawnShop\Dto\Product\ProductDto.java
package com.example.pawnShop.Dto.Product;

import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductDto {
    private UUID id;
    private String name;
    private String manufacturer;
    private String model;
    private BigDecimal price;
    private BigDecimal pawnPercentage;
    private BigDecimal secondHandPrice;
    private String picture;
    private String category;
    private String condition;
    private String color;
    private Integer size;
    private String sex;
    private Integer quantityInStock;
    private Boolean isRunOutOfStock;
    private UUID productTypeId;
}