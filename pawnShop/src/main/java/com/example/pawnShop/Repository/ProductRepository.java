// pawnShop\src\main\java\com\example\pawnShop\Repository\ProductRepository.java
package com.example.pawnShop.Repository;

import com.example.pawnShop.Entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Sort;
@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    List<Product> findByCategoryIgnoreCase(String category, Sort sort);
    
    List<Product> findByNameContainingIgnoreCaseOrManufacturerContainingIgnoreCaseOrModelContainingIgnoreCase(
        String name, String manufacturer, String model, Sort sort);
    
    List<Product> findByNameContainingIgnoreCaseOrManufacturerContainingIgnoreCaseOrModelContainingIgnoreCaseAndCategory(
        String name, String manufacturer, String model, String category, Sort sort);

    List<Product> findByOwner_Id(UUID ownerId);
}