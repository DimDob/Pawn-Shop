// pawnShop\src\main\java\com\example\pawnShop\ManualMapper\ProductManualMapperImp.java
package com.example.pawnShop.ManualMapper;

import com.example.pawnShop.Dto.Product.ProductDto;
import com.example.pawnShop.Dto.Product.ProductTypeDto;
import com.example.pawnShop.Entity.Product;
import com.example.pawnShop.Entity.ProductType;
import com.example.pawnShop.ManualMapper.Contract.ProductManualMapper;
import org.springframework.stereotype.Component;

@Component
public class ProductManualMapperImp implements ProductManualMapper {

    // Methods for ProductType mappings
    @Override
    public ProductTypeDto mapToProductTypeDto(ProductType productType) {
        return ProductTypeDto.builder()
                .id(productType.getId())
                .name(productType.getName())
                .build();
    }

    @Override
    public ProductType mapToProductType(ProductTypeDto productTypeDto) {
        return ProductType.builder()
                .id(productTypeDto.getId())
                .name(productTypeDto.getName())
                .build();
    }

    @Override
    public ProductDto mapToProductDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setManufacturer(product.getManufacturer());
        dto.setModel(product.getModel());
        dto.setPrice(product.getPrice());
        dto.setPawnPercentage(product.getPawnPercentage());
        dto.setSecondHandPrice(product.getSecondHandPrice());
        dto.setPicture(product.getPicture());
        dto.setCategory(product.getCategory());
        dto.setCondition(product.getCondition());
        dto.setColor(product.getColor());
        dto.setSize(product.getSize());
        dto.setSex(product.getSex());
        dto.setQuantityInStock(product.getQuantityInStock());
        dto.setIsRunOutOfStock(product.getIsRunOutOfStock());
        dto.setProductTypeId(product.getProductType() != null ? product.getProductType().getId() : null);
        if (product.getOwner() != null) {
            dto.setOwnerId(product.getOwner().getId());
        }
        // Include createdAt
        dto.setCreatedAt(product.getCreatedAt());
        dto.setDescription(product.getDescription());
        return dto;
    }

    @Override
    public Product mapToProduct(ProductDto productDto) {
        Product product = new Product();
        product.setName(productDto.getName());
        product.setManufacturer(productDto.getManufacturer());
        product.setModel(productDto.getModel());
        product.setPrice(productDto.getPrice());
        product.setPawnPercentage(productDto.getPawnPercentage());
        product.setSecondHandPrice(productDto.getSecondHandPrice());
        product.setPicture(productDto.getPicture());
        product.setCategory(productDto.getCategory());
        product.setCondition(productDto.getCondition());
        product.setColor(productDto.getColor());
        product.setSize(productDto.getSize());
        product.setSex(productDto.getSex());
        product.setQuantityInStock(productDto.getQuantityInStock());
        product.setIsRunOutOfStock(productDto.getIsRunOutOfStock());
        // Owner and ProductType are set in the service layer
        product.setDescription(productDto.getDescription());
        return product;
    }
}
