package com.example.pawnShop.Entity.Product;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.math.BigDecimal;
import java.util.Objects;
import java.util.UUID;

/**
 * Represents a product in the pawn shop.
 * This class is a JPA entity mapped to the 'product' table in the database.
 *
 * This class uses Lombok annotations to generate boilerplate code such as
 * getters, setters, and constructors.
 *
 * The {@code Product} class has the following properties:
 * - id: A unique identifier for each product (auto-generated).
 * - name: The name of the product.
 * - price: The price of the product.
 *
 * @see lombok.Getter
 * @see lombok.Setter
 * @see lombok.AllArgsConstructor
 * @see javax.persistence.Entity
 */

@Entity
@Table(name = "Products")
@Getter
@Setter
@RequiredArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Setter
    @Column
    public String name;

    @Column
    public BigDecimal marketPrice;

    @Column
    public BigDecimal pawnPrice;

    @Column
    public BigDecimal sellingPrice;


}
