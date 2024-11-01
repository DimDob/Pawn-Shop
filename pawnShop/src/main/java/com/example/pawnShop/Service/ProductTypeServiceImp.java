package com.example.pawnShop.Service;

import com.example.pawnShop.Dto.Product.ProductTypeDto;
import com.example.pawnShop.Dto.Result;
import com.example.pawnShop.Entity.ProductType;
import com.example.pawnShop.Factory.Contract.ProductFactory;
import com.example.pawnShop.ManualMapper.Contract.ProductManualMapper;
import com.example.pawnShop.Repository.ProductTypeRepository;
import com.example.pawnShop.Service.Contract.ProductTypeService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Transactional
@Service
@RequiredArgsConstructor
public class ProductTypeServiceImp implements ProductTypeService {

    private final ProductTypeRepository productTypeRepository;
    private final ProductManualMapper productManualMapper;
    private final ProductFactory productFactory;

    @Override
    public Result<ProductTypeDto> getProductTypeById(UUID id) {
        try {
            ProductType productType = this.productTypeRepository.findById(id).orElseThrow(
                    () -> new IllegalArgumentException("We couldn't find product type with id: " + id)
            );
            return Result.success(this.productManualMapper.mapToProductTypeDto(productType));
        } catch (Exception e) {
            return Result.error("Product type not found.");
        }
    }

    @Override
    public Result<List<ProductTypeDto>> getAllProductsTypes() {
        try {
            return Result.success(this.productTypeRepository.findAll()
                    .stream().map(this.productManualMapper::mapToProductTypeDto).toList());
        } catch (Exception e) {
            return Result.error("There is no product types.");
        }
    }

    @Override
    public Result<ProductTypeDto> addProductType(String name) {
        try {
            if (name.isBlank() || name.isEmpty()) {
                return Result.error("The name is empty.");
            }
            if (!isWordApproved(name)) {
                return Result.error("The name must be in Cyrillic.");
            }
            ProductType newProductType = this.productFactory.createProductType(name);
            this.productTypeRepository.save(newProductType);
            return Result.success(this.productManualMapper.mapToProductTypeDto(newProductType));
        } catch (Exception e) {
            return Result.error("Cannot add this product type.");
        }
    }

    @Override
    public Result<ProductTypeDto> updateProductType(UUID id, ProductTypeDto productTypeDto) {
        try {
            ProductType productType = this.productTypeRepository.findById(id).orElseThrow(
                    () -> new IllegalArgumentException("We couldn't find product type with id: " + id)
            );
            if (!productTypeDto.getId().equals(id)) {
                return Result.error("Product type id do not match.");
            }
            if (!isWordApproved(productTypeDto.getName())) {
                return Result.error("The name must be in Cyrillic.");
            }
            if (productTypeDto.getName() == null) {
                return Result.error("The name is empty.");
            }
            productType.setName(productTypeDto.getName());
            this.productTypeRepository.saveAndFlush(productType);
            return Result.success(productTypeDto);
        } catch (Exception e) {
            return Result.error("Cannot update this product type.");
        }
    }

    @Override
    public Result<ProductTypeDto> deleteProductType(UUID id) {
        try {
            ProductType productType = this.productTypeRepository.findById(id).orElseThrow(
                    () -> new IllegalArgumentException("We couldn't find product type with id: " + id)
            );
            ProductTypeDto deletedProductType = this.productManualMapper.mapToProductTypeDto(productType);
            this.productTypeRepository.delete(productType);
            return Result.success(deletedProductType);
        } catch (Exception e) {
            return Result.error("Product type do not exist.");
        }
    }

    //Check word for cyrillic and approved symbols
    private boolean isWordApproved(String word) {
        String regex = "^[а-я() .,-/]+$";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(word.toLowerCase());
        return matcher.matches();
    }
}
