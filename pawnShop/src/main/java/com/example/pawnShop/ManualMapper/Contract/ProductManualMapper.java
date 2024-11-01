package com.example.pawnShop.ManualMapper.Contract;

import com.example.pawnShop.Dto.Product.ProductTypeDto;
import com.example.pawnShop.Entity.ProductType;

public interface ProductManualMapper {

    ProductTypeDto mapToProductTypeDto(ProductType productType);

    ProductType mapToProductType(ProductTypeDto productTypeDto);

}
