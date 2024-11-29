// pawnShop\src\main\java\com\example\pawnShop\Factory\Contract\ProductFactory.java
package com.example.pawnShop.Factory.Contract;

import com.example.pawnShop.Entity.ProductType;

public interface ProductFactory {
    ProductType createProductType(String name);
}
