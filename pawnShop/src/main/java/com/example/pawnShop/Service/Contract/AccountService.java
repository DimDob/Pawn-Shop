// AccountService.java
package com.example.pawnShop.Service.Contract;

import com.example.pawnShop.Dto.Auth.UpdateMyAccountRequestDto;
import com.example.pawnShop.Dto.Result;

/**
 * Интерфейс за AccountService.
 */
public interface AccountService {

    /**
     * Метод за актуализиране на профила на текущия потребител.
     */
    Result<Boolean> updateMyAccount(UpdateMyAccountRequestDto request);

}
