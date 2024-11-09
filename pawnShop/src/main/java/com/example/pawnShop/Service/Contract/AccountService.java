// AccountService.java
package com.example.pawnShop.Service.Contract;

import com.example.pawnShop.Dto.Auth.ChangePasswordRequestDto;
import com.example.pawnShop.Dto.Auth.UpdateMyAccountRequestDto;
import com.example.pawnShop.Dto.Result;

/**
 * Interface for AccountService.
 */
public interface AccountService {

    /**
     * Method for updating the current user's profile.
     */
    Result<Boolean> updateMyAccount(UpdateMyAccountRequestDto request);

    /**
     * Method for changing the current user's password.
     */
    Result<Boolean> changePassword(ChangePasswordRequestDto request);

}
