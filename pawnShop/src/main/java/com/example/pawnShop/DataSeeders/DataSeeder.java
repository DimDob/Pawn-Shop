package com.example.pawnShop.DataSeeders;

import com.example.pawnShop.Entity.PawnShop;
import com.example.pawnShop.Entity.Role;
import com.example.pawnShop.Entity.User;
import com.example.pawnShop.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
public class UserSeeder implements CommandLineRunner {
    private PasswordEncoder passwordEncoder;
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {

        User superAdmin = new User();
        superAdmin.setId(UUID.fromString("2bd8729c-997d-4adb-a19e-9392bc42c7d8"));
        superAdmin.setEmail("superAdmin@admin.com");
        superAdmin.setFirstName("Super");
        superAdmin.setLastName("Admin");
        superAdmin.setRole(Role.SuperAdmin);
        String hashedPassword = passwordEncoder.encode("superAdmin123!");
        superAdmin.setPassword(hashedPassword);
        superAdmin.setEnable(true);

        String regularPassword = passwordEncoder.encode("admin123!");
        User firstAdmin = new User();
        firstAdmin.setId(UUID.fromString("f3028111-6be5-4930-86ca-d4c62418f149"));
        firstAdmin.setEmail("firstAdmin@admin.com");
        firstAdmin.setFirstName("First");
        firstAdmin.setLastName("Admin");
        firstAdmin.setPassword(regularPassword);
        firstAdmin.setEnable(true);
        firstAdmin.setRole(Role.Admin);

        User secondAdmin = new User();
        secondAdmin.setId(UUID.fromString("795d12bd-6f24-4167-930e-8632ce112f3d"));
        secondAdmin.setEmail("secondAdmin@admin.com");
        secondAdmin.setFirstName("Second");
        secondAdmin.setLastName("Admin");
        secondAdmin.setPassword(regularPassword);
        secondAdmin.setEnable(true);
        secondAdmin.setRole(Role.Admin);

        List<User> users = new ArrayList<>();
        users.add(superAdmin);
        users.add(firstAdmin);
        users.add(secondAdmin);

        int userCount = userRepository.getCountOfRecords();
        if(userCount <= 0){
            userRepository.saveAll(users);
        }
    }
}
