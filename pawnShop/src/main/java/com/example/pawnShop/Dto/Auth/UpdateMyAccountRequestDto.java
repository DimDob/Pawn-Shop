// UpdateMyAccountRequestDto.java
package com.example.pawnShop.Dto.Auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO за заявка за актуализиране на профила на потребителя.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateMyAccountRequestDto {

    @NotNull
    private String currentPassword; // Текуща парола за потвърждение

    private String newUsername; // Ново потребителско име

    @Email
    private String newEmail; // Нов имейл

    private String newShopAddress; // Нов адрес на магазина

}
