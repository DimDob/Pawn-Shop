// pawnShop\src\main\java\com\example\pawnShop\Service\ProductServiceImp.java
package com.example.pawnShop.Service;

import com.example.pawnShop.Dto.Product.ProductDto;
import com.example.pawnShop.Dto.Result;
import com.example.pawnShop.Entity.AppUser;
import com.example.pawnShop.Entity.Product;
import com.example.pawnShop.Entity.ProductType;
import com.example.pawnShop.ManualMapper.Contract.ProductManualMapper;
import com.example.pawnShop.Repository.ProductRepository;
import com.example.pawnShop.Repository.ProductTypeRepository;
import com.example.pawnShop.Repository.UserRepository;
import com.example.pawnShop.Service.Contract.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductServiceImp implements ProductService {

    private final ProductRepository productRepository;
    private final ProductTypeRepository productTypeRepository;
    private final UserRepository userRepository;
    private final ProductManualMapper productManualMapper;

    @Override
    public Result<ProductDto> createProduct(ProductDto productDto) {
        try {
            // Retrieve the product type
            ProductType productType = productTypeRepository.findById(productDto.getProductTypeId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid product type ID"));

            // Get current authenticated user
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            AppUser currentUser = userRepository.findByEmail(username)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            // Map DTO to entity
            Product product = productManualMapper.mapToProduct(productDto);
            product.setProductType(productType);
            product.setOwner(currentUser);

            // Save product
            productRepository.save(product);

            // Map entity to DTO
            ProductDto savedProductDto = productManualMapper.mapToProductDto(product);

            return Result.success(savedProductDto);
        } catch (Exception e) {
            return Result.error("Failed to create product: " + e.getMessage());
        }
    }

    @Override
    public Result<ProductDto> editProduct(ProductDto productDto) {
        try {
            // Retrieve the product by ID
            Product existingProduct = productRepository.findById(productDto.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));

            // Retrieve the product type
            ProductType productType = productTypeRepository.findById(productDto.getProductTypeId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid product type ID"));

            // Update product fields
            existingProduct.setName(productDto.getName());
            existingProduct.setManufacturer(productDto.getManufacturer());
            existingProduct.setModel(productDto.getModel());
            existingProduct.setPrice(productDto.getPrice());
            existingProduct.setPawnPercentage(productDto.getPawnPercentage());
            existingProduct.setSecondHandPrice(productDto.getSecondHandPrice());
            existingProduct.setPicture(productDto.getPicture());
            existingProduct.setCategory(productDto.getCategory());
            existingProduct.setCondition(productDto.getCondition());
            existingProduct.setColor(productDto.getColor());
            existingProduct.setSize(productDto.getSize());
            existingProduct.setSex(productDto.getSex());
            existingProduct.setQuantityInStock(productDto.getQuantityInStock());
            existingProduct.setIsRunOutOfStock(productDto.getIsRunOutOfStock());
            existingProduct.setProductType(productType);

            // Save the updated product
            productRepository.save(existingProduct);

            // Map entity to DTO
            ProductDto updatedProductDto = productManualMapper.mapToProductDto(existingProduct);

            return Result.success(updatedProductDto);
        } catch (Exception e) {
            return Result.error("Failed to update product: " + e.getMessage());
        }
    }
}
