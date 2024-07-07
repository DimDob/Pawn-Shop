package com.example.pawnShop.Service.Contract;

import com.example.pawnShop.Dto.Product.ProductTypeDto;

import java.util.List;
import java.util.UUID;

public interface ProductTypeService {
    ProductTypeDto getProductTypeById(UUID id);
    List<ProductTypeDto> getAllProductsTypes();
    ProductTypeDto addProductType(String name);
    ProductTypeDto updateProductType(UUID id, ProductTypeDto productTypeDto);
    ProductTypeDto deleteProductType(UUID id);
}
