// pawnShop\src\main\java\com\example\pawnShop\Dto\export\AppUserExportDTO.java
package com.example.pawnShop.Dto.export;

import com.example.pawnShop.Entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppUserExportDTO {

    private UUID id;

    private String email;

    private String firstName;

    private String lastName;

    private String password;

    private Boolean enable;

    private List<Role> roles;

    private Boolean isAdmin;

}
