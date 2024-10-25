package com.example.pawnShop.Dto.export;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentTypeExportDTO {

    private UUID id;

    private String name;

    private BigDecimal subscriptionPrice;

}
