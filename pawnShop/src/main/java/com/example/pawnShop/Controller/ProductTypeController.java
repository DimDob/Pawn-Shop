package com.example.pawnShop.Controller;

import com.example.pawnShop.Dto.Product.ProductTypeDto;
import com.example.pawnShop.Service.Contract.ProductTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProductTypeController {
    private final ProductTypeService productTypeService;

    @GetMapping
    public ResponseEntity<List<ProductTypeDto>> getAllProductsTypes(){
        var productsTypes = productTypeService.getAllProductsTypes();

        return ResponseEntity.ok(productsTypes);
    }
}
