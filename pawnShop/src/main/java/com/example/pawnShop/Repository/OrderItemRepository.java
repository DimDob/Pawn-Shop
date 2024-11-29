// pawnShop\src\main\java\com\example\pawnShop\Repository\OrderItemRepository.java
package com.example.pawnShop.Repository;

import com.example.pawnShop.Entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {
} 