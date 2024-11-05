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

    // Existing methods for ProductType mappings
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

    // New methods for Product mappings
    @Override
    public ProductDto mapToProductDto(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .manufacturer(product.getManufacturer())
                .model(product.getModel())
                .price(product.getPrice())
                .pawnPercentage(product.getPawnPercentage())
                .secondHandPrice(product.getSecondHandPrice())
                .picture(product.getPicture())
                .category(product.getCategory())
                .condition(product.getCondition())
                .color(product.getColor())
                .size(product.getSize())
                .sex(product.getSex())
                .quantityInStock(product.getQuantityInStock())
                .isRunOutOfStock(product.getIsRunOutOfStock())
                .productTypeId(product.getProductType() != null ? product.getProductType().getId() : null)
                .build();
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
        return product;
    }
}
