// AccountController.java
package com.example.pawnShop.Controller;

import com.example.pawnShop.Dto.Auth.ChangePasswordRequestDto;
import com.example.pawnShop.Dto.Auth.UpdateMyAccountRequestDto;
import com.example.pawnShop.Dto.Result;
import com.example.pawnShop.Service.Contract.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * Контролер за операции с потребителски акаунт.
 */
@RestController
@RequestMapping("/my-account")
@RequiredArgsConstructor
public class AccountController {

    // Инжектираме AccountService
    @Autowired
    private final AccountService accountService;

    /**
     * Ендпойнт за актуализиране на профила на потребителя.
     */
    @PutMapping("/update")
    public ResponseEntity<?> updateMyAccount(@Validated @RequestBody UpdateMyAccountRequestDto request) {
        Result<Boolean> result = accountService.updateMyAccount(request);
        if (!result.isSuccess()) {
            return ResponseEntity.badRequest().body(result.getError());
        }
        return ResponseEntity.ok("Account updated successfully.");
    }

    /**
     * Ендпойнт за смяна на парола на потребителя.
     */
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@Validated @RequestBody ChangePasswordRequestDto request) {
        System.out.println("Received password change request");
        Result<Boolean> result = accountService.changePassword(request);
        
        if (!result.isSuccess()) {
            System.out.println("Password change failed: " + result.getError());
            return ResponseEntity.badRequest().body(result.getError());
        }
        
        System.out.println("Password changed successfully");
        return ResponseEntity.ok("Password changed successfully");
    }
}
