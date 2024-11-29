// pawnShop\src\main\java\com\example\pawnShop\ManualMapper\Contract\ProductManualMapper.java
package com.example.pawnShop.ManualMapper.Contract;

import com.example.pawnShop.Dto.Product.ProductDto;
import com.example.pawnShop.Dto.Product.ProductTypeDto;
import com.example.pawnShop.Entity.Product;
import com.example.pawnShop.Entity.ProductType;

public interface ProductManualMapper {
    // Methods for ProductType mappings
    ProductTypeDto mapToProductTypeDto(ProductType productType);
    ProductType mapToProductType(ProductTypeDto productTypeDto);

    // Methods for Product mappings
    ProductDto mapToProductDto(Product product);
    Product mapToProduct(ProductDto productDto);
}
