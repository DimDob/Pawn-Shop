// pawnShop\src\main\java\com\example\pawnShop\Repository\AddressRepository.java
package com.example.pawnShop.Repository;

import com.example.pawnShop.Entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AddressRepository extends JpaRepository<Address, UUID> {
}
