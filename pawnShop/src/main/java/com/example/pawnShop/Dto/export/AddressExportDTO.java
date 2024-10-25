package com.example.pawnShop.Dto.export;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddressExportDTO {

    private UUID id;

    private String name;

    private String number;

}
