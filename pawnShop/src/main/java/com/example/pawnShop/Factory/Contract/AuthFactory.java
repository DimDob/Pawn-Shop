// pawnShop\src\main\java\com\example\pawnShop\Factory\Contract\AuthFactory.java
package com.example.pawnShop.Factory.Contract;

import com.example.pawnShop.Dto.Auth.LoginResponseDto;
import com.example.pawnShop.Dto.Auth.RegisterRequestDto;
import com.example.pawnShop.Entity.AppUser;

public interface AuthFactory {
    public AppUser createUser (RegisterRequestDto registerRequestDto, String encodedPassword);
}
