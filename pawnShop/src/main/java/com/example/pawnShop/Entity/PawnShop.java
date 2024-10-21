package com.example.pawnShop.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
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
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "pawn_shops")
public class PawnShop {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String UIC;

    private Boolean isViesRegistered;

    @OneToOne
    @JoinColumn(name = "address_id")
    private Address address;

    @Column(nullable = false)
    private UUID adminId;

    @OneToMany(mappedBy = "pawnShop")
    private List<AppUser> employees;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "payments_pawnshops",
            joinColumns = @JoinColumn(name = "pawnshop_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "payment_id", referencedColumnName = "id"))
    private List<Payment> payments;

    private LocalDate registrationDate;

    private LocalDate modifierDate;

    private Boolean isActive;
}
