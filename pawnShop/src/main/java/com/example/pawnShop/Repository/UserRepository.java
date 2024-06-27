package com.example.pawnShop.Repository;

import com.example.pawnShop.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    @Query("SELECT count(u) FROM User u")
    public int getCountOfRecords();
    public Optional<User> findByEmail(String email);
}
