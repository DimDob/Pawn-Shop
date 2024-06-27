package com.example.pawnShop.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "addresses")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String name;

    private String number;

    @ManyToOne
    @JoinColumn(name = "city_id")
    private City city;

    @Column(nullable = false)
    @OneToMany(mappedBy = "address")
    private List<PawnShop> pawnShops;
}
