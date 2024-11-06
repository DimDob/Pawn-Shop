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
            // Получаваме текущия потребител от SecurityContext
            AppUser currentUser = (AppUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            // Проверяваме текущата парола
            if (!passwordEncoder.matches(request.getCurrentPassword(), currentUser.getPassword())) {
                return Result.error("Incorrect current password.");
            }

            // Актуализираме потребителското име, ако е предоставено
            if (request.getNewUsername() != null && !request.getNewUsername().isEmpty()) {
                currentUser.setFirstName(request.getNewUsername());
            }

            // Актуализираме имейла, ако е предоставен и не е зает
            if (request.getNewEmail() != null && !request.getNewEmail().isEmpty()) {
                if (!currentUser.getEmail().equals(request.getNewEmail()) && 
                    userRepository.findByEmail(request.getNewEmail()).isPresent()) {
                    return Result.error("Email already in use.");
                }
                currentUser.setEmail(request.getNewEmail());
            }

            // Актуализираме адреса на магазина
            if (request.getNewShopAddress() != null && !request.getNewShopAddress().isEmpty()) {
                PawnShop pawnShop = currentUser.getPawnShop();
                
                if (pawnShop == null) {
                    // Създаваме нов PawnShop ако няма
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
                            .uic(UUID.randomUUID().toString()) // Генерираме уникален UIC
                            .build();
                    
                    pawnShop = pawnShopRepository.save(pawnShop);
                    currentUser.setPawnShop(pawnShop);
                } else {
                    // Актуализираме съществуващия адрес
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

            // Запазваме промените в потребителя
            userRepository.save(currentUser);
            return Result.success(true);
            
        } catch (Exception e) {
            return Result.error("Error updating account: " + e.getMessage());
        }
    }

    @Override
    public Result<Boolean> changePassword(ChangePasswordRequestDto request) {
        try {
            // Получаваме текущия потребител
            AppUser currentUser = (AppUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            
            // Проверяваме текущата парола
            if (!passwordEncoder.matches(request.getCurrentPassword(), currentUser.getPassword())) {
                return Result.error("Current password is incorrect");
            }
            
            // Проверяваме дали новата парола и потвърждението съвпадат
            if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
                return Result.error("New password and confirmation do not match");
            }
            
            // Проверяваме дали новата парола е различна от старата
            if (passwordEncoder.matches(request.getNewPassword(), currentUser.getPassword())) {
                return Result.error("New password must be different from current password");
            }
            
            // Хеширане и запазване на новата парола
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
