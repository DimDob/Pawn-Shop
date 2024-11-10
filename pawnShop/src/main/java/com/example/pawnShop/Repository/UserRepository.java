// pawnShop/src/main/java/com/example/pawnShop/Repository/UserRepository.java

package com.example.pawnShop.Repository;

import com.example.pawnShop.Entity.AppUser;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<AppUser, UUID> {

    Optional<AppUser> findByEmail(String email);

    Optional<AppUser> findByEmailConfirmationToken(String token);

    @EntityGraph(attributePaths = "favoriteProducts")
    Optional<AppUser> findWithFavoritesByEmail(String email);
}
