package com.example.pawnShop.Service.Contract;

import com.example.pawnShop.Entity.AppUser;

public interface JwtService {
    public String generateJwtToken(AppUser user);
}
