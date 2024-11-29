// pawnShop\src\main\java\com\example\pawnShop\Dto\Product\ProductDto.java
package com.example.pawnShop.Dto.Product;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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
    private UUID ownerId;
    private LocalDateTime createdAt;
    private String description;

    public UUID getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(UUID ownerId) {
        this.ownerId = ownerId;
    }
}
