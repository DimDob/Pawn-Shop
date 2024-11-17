// pawnShop\src\main\java\com\example\pawnShop\Service\AccountServiceImp.java
package com.example.pawnShop.Service;

import com.example.pawnShop.Dto.Auth.ChangePasswordRequestDto;
import com.example.pawnShop.Dto.Auth.UpdateMyAccountRequestDto;
import com.example.pawnShop.Dto.Result;
import com.example.pawnShop.Entity.AppUser;
import com.example.pawnShop.Entity.Address;
import com.example.pawnShop.Entity.PawnShop;
import com.example.pawnShop.Repository.AddressRepository;
import com.example.pawnShop.Repository.PawnShopRepository;
import com.example.pawnShop.Repository.UserRepository;
import com.example.pawnShop.Service.Contract.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.UUID;
/**
 * Имплементация на AccountService.
 */
@Service
@RequiredArgsConstructor
public class AccountServiceImp implements AccountService {

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final PasswordEncoder passwordEncoder;

    @Autowired
    private final AddressRepository addressRepository;

    @Autowired
    private final PawnShopRepository pawnShopRepository;

    @Override
    public Result<Boolean> updateMyAccount(UpdateMyAccountRequestDto request) {
        try {
            // We get the current user from the SecurityContext
            AppUser currentUser = (AppUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            // We check the current password
            if (!passwordEncoder.matches(request.getCurrentPassword(), currentUser.getPassword())) {
                return Result.error("Incorrect current password.");
            }

            // We update the username if it is provided
            if (request.getNewUsername() != null && !request.getNewUsername().isEmpty()) {
                currentUser.setFirstName(request.getNewUsername());
            }

            // We update the email if it is provided and not already in use
            if (request.getNewEmail() != null && !request.getNewEmail().isEmpty()) {
                if (!currentUser.getEmail().equals(request.getNewEmail()) && 
                    userRepository.findByEmail(request.getNewEmail()).isPresent()) {
                    return Result.error("Email already in use.");
                }
                currentUser.setEmail(request.getNewEmail());
            }

            // We update the shop address if it is provided
            if (request.getNewShopAddress() != null && !request.getNewShopAddress().isEmpty()) {
                PawnShop pawnShop = currentUser.getPawnShop();
                
                if (pawnShop == null) {
                    // We create a new PawnShop if there is none
                    Address address = Address.builder()
                            .street(request.getNewShopAddress())
                            .build();
                    address = addressRepository.save(address);

                    pawnShop = PawnShop.builder()
                            .name("Shop of " + currentUser.getFirstName())
                            .address(address)
                            .admin(currentUser)
                            .isActive(true)
                            .registrationDate(LocalDate.now())
                            .modifierDate(LocalDate.now())
                            .uic(UUID.randomUUID().toString()) 
                            .build();
                    
                    pawnShop = pawnShopRepository.save(pawnShop);
                    currentUser.setPawnShop(pawnShop);
                } else {
                    // We update the existing address
                    Address address = pawnShop.getAddress();
                    if (address == null) {
                        address = Address.builder()
                                .street(request.getNewShopAddress())
                                .build();
                    } else {
                        address.setStreet(request.getNewShopAddress());
                    }
                    addressRepository.save(address);
                    pawnShop.setAddress(address);
                    pawnShopRepository.save(pawnShop);
                }
            }

            // We save the changes to the user
            userRepository.save(currentUser);
            return Result.success(true);
            
        } catch (Exception e) {
            return Result.error("Error updating account: " + e.getMessage());
        }
    }

    @Override
    public Result<Boolean> changePassword(ChangePasswordRequestDto request) {
        try {
            // We get the current user
            AppUser currentUser = (AppUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            
            // We check the current password
            if (!passwordEncoder.matches(request.getCurrentPassword(), currentUser.getPassword())) {
                return Result.error("Current password is incorrect");
            }
            
            // We check if the new password and confirmation match
            if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
                return Result.error("New password and confirmation do not match");
            }
            
            // We check if the new password is different from the current one
            if (passwordEncoder.matches(request.getNewPassword(), currentUser.getPassword())) {
                return Result.error("New password must be different from current password");
            }
            
            // We hash and save the new password
            currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(currentUser);
            
            System.out.println("Password changed successfully for user: " + currentUser.getEmail());
            return Result.success(true);
            
        } catch (Exception e) {
            System.out.println("Error changing password: " + e.getMessage());
            return Result.error("Error changing password: " + e.getMessage());
        }
    }
}
