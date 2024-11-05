// pawnShop\src\main\java\com\example\pawnShop\Dto\export\ProductExportDTO.java
package com.example.pawnShop.Dto.export;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductExportDTO {

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

    public String getPrice() {
        return price != null ? price.toString() : "0";
    }

}
