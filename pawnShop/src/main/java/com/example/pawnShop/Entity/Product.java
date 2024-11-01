package com.example.pawnShop.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.math.BigDecimal;
import java.util.Objects;
import java.util.UUID;

/**
 * Represents a product in the pawn shop.
 * This class is a JPA entity mapped to the 'product' table in the database.
 * <p>
 * This class uses Lombok annotations to generate boilerplate code such as
 * getters, setters, and constructors.
 * <p>
 * The {@code Product} class has the following properties:
 * - id: A unique identifier for each product (auto-generated).
 * - name: The name of the product.
 * - price: The price of the product.
 *
 * @see lombok.Getter
 * @see lombok.Setter
 * @see lombok.AllArgsConstructor
 * //@see javax.persistence.Entity
 */

@Entity
@Table(name = "products")
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "picture", columnDefinition = "TEXT")
    private String pictureUrl;

    @Basic
    private String color;

    @Basic
    private Integer size;

    @Basic
    private String sex;

    @Column(nullable = false)
    private String manufacturer;

    @Basic
    private String model;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "product_type")
    private ProductType productType;

    @Basic
    private BigDecimal price;

    @Column(name = "quantity_in_stock")
    private Integer quantityInStock;

    @Column(name = "is_run_out_of_stock")
    private Boolean isRunOutOfStock;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private AppUser owner;

    @Column(name = "pawn_percentage")
    private BigDecimal pawnPercentage;

    @Column(name = "second_hand_price")
    private BigDecimal secondHandPrice;

}
