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
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.List;
import org.springframework.data.domain.Sort;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
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

    @Override
    public Result<ProductDto> getProductById(UUID id) {
        try {
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));
            
            // Log owner details for debugging
            if (product.getOwner() != null) {
                System.out.println("Product owner ID: " + product.getOwner().getId());
                System.out.println("Product owner email: " + product.getOwner().getEmail());
            } else {
                System.out.println("Product has no owner");
            }
            
            ProductDto productDto = productManualMapper.mapToProductDto(product);
            return Result.success(productDto);
        } catch (Exception e) {
            return Result.error("Failed to retrieve product: " + e.getMessage());
        }
    }

    @Override
    public Result<Void> deleteProductById(UUID id) {
        try {
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));
            productRepository.delete(product);
            return Result.success(null);
        } catch (Exception e) {
            return Result.error("Failed to delete product: " + e.getMessage());
        }
    }
     @Override
    public Result<List<ProductDto>> getProductsByCurrentUser() {
        try {
            // Get current authenticated user
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            AppUser currentUser = userRepository.findByEmail(username)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            // Get products by owner ID
            List<Product> products = productRepository.findByOwner_Id(currentUser.getId());

            // Map products to ProductDto
            List<ProductDto> productDtos = products.stream()
                    .map(productManualMapper::mapToProductDto)
                    .collect(Collectors.toList());

            return Result.success(productDtos);
        } catch (Exception e) {
            return Result.error("Failed to retrieve products: " + e.getMessage());
        }
    }

    @Override
    public List<ProductDto> getAllProducts(String sortBy, String category, String searchTerm) {
        Sort sort;
        
        // Default sort if sortBy is null or empty
        if (sortBy == null || sortBy.isEmpty()) {
            sort = Sort.by(Sort.Direction.DESC, "createdAt");
        } else {
            switch(sortBy) {
                case "priceLowToHigh":
                    sort = Sort.by(Sort.Direction.ASC, "price");
                    break;
                case "priceHighToLow":
                    sort = Sort.by(Sort.Direction.DESC, "price");
                    break;
                case "newest":
                    sort = Sort.by(Sort.Direction.DESC, "createdAt");
                    break;
                default:
                    sort = Sort.by(Sort.Direction.DESC, "createdAt");
            }
        }

        try {
            List<Product> products;
            
            if (searchTerm != null && !searchTerm.isEmpty()) {
                // Search in name, manufacturer, and model
                if (category != null && !category.isEmpty() && !category.equalsIgnoreCase("All")) {
                    products = productRepository.findByNameContainingIgnoreCaseOrManufacturerContainingIgnoreCaseOrModelContainingIgnoreCaseAndCategory(
                        searchTerm, searchTerm, searchTerm, category, sort);
                } else {
                    products = productRepository.findByNameContainingIgnoreCaseOrManufacturerContainingIgnoreCaseOrModelContainingIgnoreCase(
                        searchTerm, searchTerm, searchTerm, sort);
                }
            } else if (category != null && !category.isEmpty() && !category.equalsIgnoreCase("All")) {
                products = productRepository.findByCategoryIgnoreCase(category, sort);
            } else {
                products = productRepository.findAll(sort);
            }

            log.info("Found {} products", products.size());
            return products.stream()
                    .map(productManualMapper::mapToProductDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching products: ", e);
            throw new RuntimeException("Error fetching products: " + e.getMessage());
        }
    }

    @Override
    public Result<List<ProductDto>> getAllProductsForAdmin() {
        try {
            log.info("Fetching all products for admin");
            List<Product> products = productRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
            
            List<ProductDto> productDtos = products.stream()
                    .map(productManualMapper::mapToProductDto)
                    .collect(Collectors.toList());
                    
            log.info("Successfully fetched {} products for admin", productDtos.size());
            return Result.success(productDtos);
        } catch (Exception e) {
            log.error("Error fetching products for admin: ", e);
            return Result.error("Failed to retrieve products: " + e.getMessage());
        }
    }
}
