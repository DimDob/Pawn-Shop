// pawnShop\src\main\java\com\example\pawnShop\Service\Contract\ProductService.java
package com.example.pawnShop.Service.Contract;

import com.example.pawnShop.Dto.Product.ProductDto;
import com.example.pawnShop.Dto.Result;
import java.util.List;
import java.util.UUID;
public interface ProductService {
    Result<ProductDto> createProduct(ProductDto productDto);
    Result<ProductDto> editProduct(ProductDto productDto);
    Result<ProductDto> getProductById(UUID id);
    Result<Void> deleteProductById(UUID id);
    Result<List<ProductDto>> getProductsByCurrentUser();
    List<ProductDto> getAllProducts(String sortBy, String category, String searchTerm);
    Result<List<ProductDto>> getAllProductsForAdmin();
}
