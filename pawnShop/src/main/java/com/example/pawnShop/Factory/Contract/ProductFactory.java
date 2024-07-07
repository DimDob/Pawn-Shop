package com.example.pawnShop.Factory.Contract;

import com.example.pawnShop.Entity.ProductType;

public interface ProductFactory {
    ProductType createProductType(String name);
}
