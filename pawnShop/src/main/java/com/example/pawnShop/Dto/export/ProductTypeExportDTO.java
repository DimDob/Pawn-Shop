package com.example.pawnShop.Dto.export;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductTypeExportDTO {

    private UUID id;

    private String name;

    private String productName;

}
