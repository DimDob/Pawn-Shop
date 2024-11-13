// pawnShop\src\main\java\com\example\pawnShop\Service\Contract\JwtService.java
package com.example.pawnShop.Service.Contract;

import com.example.pawnShop.Entity.AppUser;
import io.jsonwebtoken.Claims;

import java.util.Map;
import java.util.function.Function;

public interface JwtService {
    public String generateJwtToken(AppUser user);
    public String generateJwtToken(Map<String, Object> extraClaims, AppUser user);
    public String extractSubject(String token);
    public <T> T extractClaim(String token, Function<Claims,T> claimsResolver);
    public boolean isTokenValid(String token);
    String generateRefreshToken(AppUser user);
}
