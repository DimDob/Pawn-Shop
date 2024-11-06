// pawnShop\src\main\java\com\example\pawnShop\Entity\Address.java
package com.example.pawnShop.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @Basic
    private String name;

    @Basic
    private String number;

    @Basic
    private String street; 

    @ManyToOne
    @JoinColumn(name = "city_id")
    private City city;

    @OneToOne(mappedBy = "address")
    @JoinColumn(name = "pawnshop_id", referencedColumnName = "id")
    private PawnShop pawnShop;

}
