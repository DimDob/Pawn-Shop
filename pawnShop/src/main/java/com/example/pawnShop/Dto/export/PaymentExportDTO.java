// pawnShop\src\main\java\com\example\pawnShop\Dto\export\PaymentExportDTO.java
package com.example.pawnShop.Dto.export;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentExportDTO {

    private UUID id;

    private String paymentTypeName;

    private LocalDateTime subscriptionStartDate;

    private LocalDateTime subscriptionEndDate;

}
