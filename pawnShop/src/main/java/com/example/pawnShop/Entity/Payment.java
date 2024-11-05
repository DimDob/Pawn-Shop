// pawnShop\src\main\java\com\example\pawnShop\Entity\Payment.java
package com.example.pawnShop.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "payment_type_id")
    private PaymentType paymentType;

    @ManyToMany(mappedBy = "payments")
    private List<PawnShop> pawnShopList;

    @Column(name = "subscription_start_date")
    private LocalDateTime subscriptionStartDate;

    @Column(name = "subscription_end_date")
    private LocalDateTime subscriptionEndDate;

}
