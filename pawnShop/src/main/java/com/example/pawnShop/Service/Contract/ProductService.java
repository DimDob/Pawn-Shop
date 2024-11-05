// pawnShop\src\main\java\com\example\pawnShop\Service\Contract\ProductService.java
package com.example.pawnShop.Service.Contract;

import com.example.pawnShop.Dto.Product.ProductDto;
import com.example.pawnShop.Dto.Result;

public interface ProductService {
    Result<ProductDto> createProduct(ProductDto productDto);
    Result<ProductDto> editProduct(ProductDto productDto);
    // Additional methods can be added here.
}
