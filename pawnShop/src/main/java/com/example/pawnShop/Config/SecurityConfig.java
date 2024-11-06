// pawnShop\src\main\java\com\example\pawnShop\Config\SecurityConfig.java
package com.example.pawnShop.Config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import java.util.List;

@EnableWebSecurity
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(registry -> {
                    registry.requestMatchers("/home/index", "/auth/**", "/data/expose/**").permitAll();
                    registry.requestMatchers("/home/superAdmin").hasRole("SUPER_ADMIN");
                    registry.requestMatchers("/home/admin", "/product_type/**").hasAnyRole("SUPER_ADMIN", "ADMIN");
                     // registry.requestMatchers("/product-add").hasAnyRole("SUPER_ADMIN", "ADMIN", "USER");
                    // registry.requestMatchers("/favorites/**").authenticated();
                    // registry.requestMatchers("/product-add/**").authenticated();
                    // registry.requestMatchers("/product-edit/**").authenticated();
                    // registry.requestMatchers("/product-delete/**").authenticated();
                    // registry.requestMatchers("/my-products/**").authenticated();
                    // registry.requestMatchers("/my-account/**").authenticated(); // Добавихме този ред
                    registry.anyRequest().authenticated();
                })
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:4200"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}