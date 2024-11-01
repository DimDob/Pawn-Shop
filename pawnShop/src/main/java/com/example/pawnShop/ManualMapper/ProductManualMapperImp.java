package com.example.pawnShop.ManualMapper;

import com.example.pawnShop.Dto.Product.ProductTypeDto;
import com.example.pawnShop.Entity.ProductType;
import com.example.pawnShop.ManualMapper.Contract.ProductManualMapper;
import org.springframework.stereotype.Component;

@Component
public class ProductManualMapperImp implements ProductManualMapper {

    @Override
    public ProductTypeDto mapToProductTypeDto(ProductType productType) {
            return ProductTypeDto
                    .builder()
                    .id(productType.getId())
                    .name(productType.getName())
                    .build();
    }

    @Override
    public ProductType mapToProductType(ProductTypeDto productTypeDto) {
        return ProductType
                .builder()
                .name(productTypeDto.getName())
                .build();
    }
}
