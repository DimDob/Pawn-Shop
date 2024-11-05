// pawnShop\src\main\java\com\example\pawnShop\Repository\PaymentTypeRepository.java
package com.example.pawnShop.Repository;

import com.example.pawnShop.Entity.PaymentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PaymentTypeRepository extends JpaRepository<PaymentType, UUID> {
}
