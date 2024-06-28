package com.example.pawnShop.Service;

import com.example.pawnShop.Entity.AppUser;
import com.example.pawnShop.Service.Contract.JwtService;

public class JwtServiceImp implements JwtService {
    private static final String SECRET_KEY = "7BE0B397565E158158AE1DAF477D25C46E5429203120C4565CD7CE0530CE1C69";

    @Override
    public String generateJwtToken(AppUser user) {
        return "";
    }
}
