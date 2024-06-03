package com.example.pawnShop.config;

import com.okta.spring.boot.oauth.Okta;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.accept.HeaderContentNegotiationStrategy;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                //Disable Cross Site Request Forgery
                .csrf(csrf -> csrf.disable());

        // Protect endpoints at /api/<type>/secure
        http .authorizeHttpRequests(auth -> auth
//                        .requestMatchers(add matchers).authenticated()
                        .anyRequest().permitAll()

                )
                .oauth2ResourceServer((oauth2) -> oauth2
                        .jwt(Customizer.withDefaults())
                );

        //Add CORS filters
        http .cors(Customizer.withDefaults());

        //Add content negotiation strategy
        http.setSharedObject(ContentNegotiationStrategy.class,
                new HeaderContentNegotiationStrategy());


// Force a non-empty response body for 401 to make the response friendly
        Okta.configureResourceServer401ResponseBody(http);

        return http.build();
    }
}