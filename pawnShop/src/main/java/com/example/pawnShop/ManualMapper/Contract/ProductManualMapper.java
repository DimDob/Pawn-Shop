// pawnShop\src\main\java\com\example\pawnShop\ManualMapper\Contract\ProductManualMapper.java
package com.example.pawnShop.ManualMapper.Contract;

import com.example.pawnShop.Dto.Product.ProductTypeDto;
import com.example.pawnShop.Entity.ProductType;

public interface ProductManualMapper {
    public ProductTypeDto mapToProductTypeDto(ProductType productType);
    public ProductType mapToProductType(ProductTypeDto productTypeDto);
}
