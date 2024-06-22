package com.example.pawnShop.Repository;

import com.example.pawnShop.Entity.ProductType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProductTypeRepository extends JpaRepository<ProductType, UUID> {

    @Query("SELECT count(p) FROM ProductType p")
    public int getCountOfRecords();
}
