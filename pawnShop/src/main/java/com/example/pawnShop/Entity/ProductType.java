package com.example.pawnShop.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
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
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "products_types")
public class ProductType {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(unique = true, nullable = false, length = 32)
    private String name;

    @OneToMany(mappedBy = "productType")
    private List<Product> products;

}
