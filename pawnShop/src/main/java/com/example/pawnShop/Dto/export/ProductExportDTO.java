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

    private BigDecimal marketPrice;

    private BigDecimal pawnPercentage;

    private BigDecimal secondHandPrice;

    private String pictureUrl;

    private String productTypeName;

}
