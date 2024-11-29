// pawnShop\src\main\java\com\example\pawnShop\Entity\PawnShop.java
package com.example.pawnShop.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Represents a product type in the pawn shop.
 * This class is a JPA entity mapped to the 'pawns_shops' table in the database.
 * <p>
 * This class uses Lombok annotations to generate boilerplate code such as
 * getters, setters, and constructors.
 * <p>
 * The {@code PawnShop} class has the following properties:
 * - id: A unique identifier for each pawn shop (auto-generated),
 * - name: The name of the type of product,
 * - UIC: Unique Identification Code - represent registration of the company in a commercial register under local law,
 * - isViesRegistered: Show vies registration,
 * - address: Address of the company,
 * - adminId: UUID of admin,
 * - employees: List of employees,
 * - payments: Stored payments for subscription of pawn shop,
 * - registrationDate: Date of registration,
 * - modifierDate: Date of modifier;
 * - isActive: Show current state.
 *
 * @see lombok.Data
 * @see lombok.AllArgsConstructor
 * @see javax.persistence.Entity
 */

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "pawn_shops")
public class PawnShop {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String uic;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "is_vies_registered")
    private Boolean isViesRegistered;

    @Column(name = "registration_date")
    private LocalDate registrationDate;

    @Column(name = "modifier_date")
    private LocalDate modifierDate;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id")
    private Address address;

    @OneToOne
    @JoinColumn(name = "admin_id")
    private AppUser admin;

    @ManyToMany(mappedBy = "pawnShopList")
    private List<Payment> payments = new ArrayList<>();

}
