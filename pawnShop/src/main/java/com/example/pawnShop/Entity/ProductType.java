package com.example.pawnShop.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

/**
 * Represents a product type in the pawn shop.
 * This class is a JPA entity mapped to the 'product_type' table in the database.

 * This class uses Lombok annotations to generate boilerplate code such as
 * getters, setters, and constructors.

 * The {@code ProductType} class has the following properties:
 * - id: A unique identifier for each product (auto-generated).
 * - name: The name of the type of product.
 *
 * @see lombok.Data
 * @see lombok.AllArgsConstructor
 * @see javax.persistence.Entity
 */

@Entity
@Table(name = "Product_Type")
@Data
@AllArgsConstructor
@Builder
public class ProductType {

    private final int PRODUCT_TYPE_NAME_MAX_LENGTH = 32;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(unique = true, nullable = false, length = PRODUCT_TYPE_NAME_MAX_LENGTH)
    private String name;
}
