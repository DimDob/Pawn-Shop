package com.example.pawnShop.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface Payment extends JpaRepository<Payment, UUID> {
}
