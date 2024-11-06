// pawnShop\src\main\java\com\example\pawnShop\Entity\AppUser.java
package com.example.pawnShop.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

@Entity
@Data
@AllArgsConstructor
@Builder
@Table(name = "users")
public class AppUser implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(nullable = false)
    private String password;

    @Basic
    private Boolean enable;

    @Enumerated(EnumType.STRING)
    @ElementCollection(targetClass = Role.class, fetch = FetchType.EAGER)
    private List<Role> roles;

    @ManyToOne
    @JoinColumn(name = "pawnshop_id")
    private PawnShop pawnShop;

    @Column(name = "is_admin")
    private Boolean isAdmin;

    @ManyToMany
    @JoinTable(
        name = "user_favorites",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private Set<Product> favoriteProducts = new HashSet<>();

    // Keep only one default constructor
    public AppUser() {
        enable = true;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return mapRoleToGrantedAuthority();
    }

    @Override
    public String getPassword() {
        return password;
    }

    // Changed getUsername to return email for authentication
    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enable;
    }

    private List<? extends GrantedAuthority> mapRoleToGrantedAuthority() {
        List<SimpleGrantedAuthority> grantedAuthorities = new ArrayList<>();
        for (Role s : roles) {
            SimpleGrantedAuthority newAuthority = new SimpleGrantedAuthority(s.toString());
            grantedAuthorities.add(newAuthority);
        }
        return grantedAuthorities;
    }
}
