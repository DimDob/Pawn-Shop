package com.example.pawnShop.Factory;

import com.example.pawnShop.Entity.ProductType;
import com.example.pawnShop.Factory.Contract.ProductFactory;
import org.springframework.stereotype.Component;

@Component
public class ProductFactoryImp implements ProductFactory {

    @Override
    public ProductType createProductType(String name) {
        return ProductType
                .builder()
                .name(name)
                .build();
    }

}
