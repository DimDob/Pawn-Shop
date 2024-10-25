package com.example.pawnShop.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

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

    private String firstName;

    private String lastName;

    @Column(nullable = false)
    private String password;

    private Boolean enable;

    @Enumerated(EnumType.STRING)
    @ElementCollection(targetClass = Role.class)
    private List<Role> roles;

    @ManyToOne
    @JoinColumn(name = "pawnshop_id")
    private PawnShop pawnShop;

    private Boolean isAdmin;

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

    @Override
    public String getUsername() {
        return firstName + " " + lastName;
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
