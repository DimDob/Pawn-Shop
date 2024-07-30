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
 * //@see javax.persistence.Entity
 */

@Entity
@Table(name = "products")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Product {




    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "product_type_id")
    private ProductType productType;

    @Column(name = "market_price")
    private BigDecimal marketPrice;

    @Column(name = "pawn_percentage")
    private BigDecimal pawnPercentage;

    @Column(name = "second_hand_price")
    private BigDecimal secondHandPrice;

    @Column(name = "picture_url", columnDefinition = "TEXT")
    private String pictureUrl;

    public Product setId(UUID id) {
        this.id = id;
        return this;
    }

    public Product setName(String name) {
        this.name = name;
        return this;
    }

    public Product setMarketPrice(BigDecimal marketPrice) {
        this.marketPrice = marketPrice;
        return this;
    }

    public Product setPawnPercentage(BigDecimal pawnPercentage) {
        this.pawnPercentage = pawnPercentage;
        return this;
    }

    public Product setSecondHandPrice(BigDecimal secondHandPrice) {
        this.secondHandPrice = secondHandPrice;
        return this;
    }

    public Product setPictureUrl(String pictureUrl) {
        this.pictureUrl = pictureUrl;
        return this;
    }
}
