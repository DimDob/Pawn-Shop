package com.example.pawnShop.Service.Contract;

import com.example.pawnShop.Dto.Product.ProductTypeDto;
import com.example.pawnShop.Dto.Result;

import java.util.List;
import java.util.UUID;

public interface ProductTypeService {

    Result<ProductTypeDto> getProductTypeById(UUID id);

    Result<List<ProductTypeDto>> getAllProductsTypes();

    Result<ProductTypeDto> addProductType(String name);

    Result<ProductTypeDto> updateProductType(UUID id, ProductTypeDto productTypeDto);

    Result<ProductTypeDto> deleteProductType(UUID id);

}
