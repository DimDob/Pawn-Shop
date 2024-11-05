// pawnShop\src\main\java\com\example\pawnShop\Dto\Auth\LoginResponseDto.java
package com.example.pawnShop.Dto.Auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponseDto {
    private String username;
    private String token;
    private Boolean isAdmin;
}
