package com.example.pawnShop.Repository;

import com.example.pawnShop.Entity.PawnShop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PawnShopRepository extends JpaRepository<PawnShop, UUID> {
}
