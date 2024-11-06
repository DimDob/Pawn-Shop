package com.example.pawnShop.Service;

import com.example.pawnShop.Dto.Auth.UpdateMyAccountRequestDto;
import com.example.pawnShop.Dto.Result;
import com.example.pawnShop.Entity.AppUser;
import com.example.pawnShop.Repository.AddressRepository;
import com.example.pawnShop.Repository.PawnShopRepository;
import com.example.pawnShop.Repository.UserRepository;
import com.example.pawnShop.Service.Contract.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
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
            if (userRepository.findByEmail(request.getNewEmail()).isPresent()) {
                return Result.error("Email already in use.");
            }
            currentUser.setEmail(request.getNewEmail());
        }

        // Актуализираме адреса на магазина, ако е предоставен
        if (request.getNewShopAddress() != null && !request.getNewShopAddress().isEmpty()) {
            if (currentUser.getPawnShop() != null && currentUser.getPawnShop().getAddress() != null) {
                currentUser.getPawnShop().getAddress().setStreet(request.getNewShopAddress());
                // Запазваме адреса
                addressRepository.save(currentUser.getPawnShop().getAddress());
            } else {
                return Result.error("User does not have an associated PawnShop or Address.");
            }
        }

        // Запазваме промените в потребителя
        userRepository.save(currentUser);
        return Result.success(true);
    }
}
