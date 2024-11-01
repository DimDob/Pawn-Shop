package com.example.pawnShop.Service.Contract;

import com.example.pawnShop.Entity.AppUser;
import io.jsonwebtoken.Claims;

import java.util.function.Function;

public interface JwtService {

    String generateJwtToken(AppUser user);

    String extractSubject(String token);

    <T> T extractClaim(String token, Function<Claims, T> claimsResolver);

    boolean isTokenValid(String token);

}
