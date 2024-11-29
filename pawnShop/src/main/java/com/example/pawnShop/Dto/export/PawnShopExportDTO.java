// pawnShop\src\main\java\com\example\pawnShop\Dto\export\PawnShopExportDTO.java
package com.example.pawnShop.Dto.export;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PawnShopExportDTO {

    private UUID id;

    private String name;

    private String UIC;

    private Boolean isViesRegistered;

    private UUID addressId;

    private UUID adminId;

    private LocalDate registrationDate;

    private LocalDate modifierDate;

    private Boolean isActive;

}
