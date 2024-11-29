// pawnShop\src\main\java\com\example\pawnShop\Repository\PaymentRepository.java
package com.example.pawnShop.Repository;

import com.example.pawnShop.Entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
}
