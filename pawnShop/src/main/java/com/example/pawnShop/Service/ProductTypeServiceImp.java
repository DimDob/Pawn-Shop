package com.example.pawnShop.Service;

import com.example.pawnShop.Dto.Product.ProductTypeDto;
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

    private final ProductTypeRepository repository;
    private final ProductManualMapper mapper;
    private final ProductFactory factory;

    @Override
    public ProductTypeDto getProductTypeById(UUID id) {

        //todo decide how to manage exceptions
        ProductType productType = repository.findById(id).orElseThrow();

        return mapper.mapToProductTypeDto(productType);
    }

    @Override
    public List<ProductTypeDto> getAllProductsTypes() {
        return repository.findAll().stream().map(mapper::mapToProductTypeDto).toList();
    }

    @Override
    public String addProductType(String name) {
        if(name.isBlank() || name.isEmpty()){
            return "";
        }
        if(!isWordApproved(name)){
            return "";
        }
        ProductType newProduct = factory.createProductType(name);

        repository.save(newProduct);

        return name;
    }

    @Override
    public String updateProductType(UUID id, ProductTypeDto productTypeDto) {
        if(!isWordApproved(productTypeDto.getName())){
            return "";
        }

        ProductType productType = repository.findById(id).orElseThrow();
        if(productTypeDto.getName() != null){
            productType.setName(productTypeDto.getName());
            repository.save(productType);

            return productTypeDto.getName();
        }

        return "";
    }

    @Override
    public String deleteProductType(UUID id) {
        ProductType productType = repository.findById(id).orElseThrow();

        repository.delete(productType);

        return productType.getName();
    }

    //Check word for cyrillic and approved symbols
    private boolean isWordApproved(String word){
        String regex = "^[а-я() .,-/]+$";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(word.toLowerCase());

        return matcher.matches();
    }
}
