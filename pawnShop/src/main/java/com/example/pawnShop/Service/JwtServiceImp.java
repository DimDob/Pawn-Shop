package com.example.pawnShop.Service;

import com.example.pawnShop.Entity.AppUser;
import com.example.pawnShop.Service.Contract.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;

@Service
public class JwtServiceImp implements JwtService {

    private static final String SECRET_KEY = "7BE0B397565E158158AE1DAF477D25C46E5429203120C4565CD7CE0530CE1C69";
    private static final Long VALIDITY_TIME = TimeUnit.MINUTES.toMillis(30);

    @Override
    public String generateJwtToken(AppUser user) {
        return Jwts.builder()
                .subject(user.getEmail())
                .issuedAt(Date.from(Instant.now()))
                .expiration(Date.from(Instant.now().plusMillis(VALIDITY_TIME)))
                .signWith(generateKey())
                .compact();
    }

    @Override
    public String extractSubject(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    @Override
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = extractClaims(token);
        return claimsResolver.apply(claims);
    }

    @Override
    public boolean isTokenValid(String token) {
        Date expireDate = extractClaim(token, Claims::getExpiration);
        return expireDate.after(Date.from(Instant.now()));
    }

    private SecretKey generateKey() {
        byte[] decodedKey = Base64.getDecoder().decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(decodedKey);
    }

    private Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(generateKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

}
