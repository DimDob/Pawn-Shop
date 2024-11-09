// UpdateMyAccountRequestDto.java
package com.example.pawnShop.Dto.Auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for the request to update the user's profile.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateMyAccountRequestDto {

    @NotNull
    private String currentPassword; 

    private String newUsername;

    @Email
    private String newEmail;

    private String newShopAddress; 

}
