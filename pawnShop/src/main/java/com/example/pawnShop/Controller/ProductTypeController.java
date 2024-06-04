package com.example.pawnShop.Controller;

import com.example.pawnShop.Dto.Product.ProductTypeDto;
import com.example.pawnShop.Service.Contract.ProductTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/product_type")
public class ProductTypeController {
    private final ProductTypeService productTypeService;

    @GetMapping("/get_all")
    public ResponseEntity<List<ProductTypeDto>> getAllProductsTypes(){
        var productsTypes = productTypeService.getAllProductsTypes();

        return ResponseEntity.ok(productsTypes);
    }
    @GetMapping("/get_by_id")
    public ResponseEntity<ProductTypeDto> getProductTypeById(UUID id){
        var productType = productTypeService.getProductTypeById(id);

        return ResponseEntity.ok(productType);
    }
    @PostMapping("/add")
    public ResponseEntity<String> addProductType(String productTypeName){
        var newProductTypeName = productTypeService.addProductType(productTypeName);

        return ResponseEntity.ok(newProductTypeName);
    }
    @PostMapping("/modify")
    public ResponseEntity<String> addProductType(ProductTypeDto modifiedProductType){
        var modifiedProductTypeName = productTypeService.updateProductType(modifiedProductType);

        return ResponseEntity.ok(modifiedProductTypeName);
    }
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteProductType(UUID id){
        var removedProductTypeName = productTypeService.deleteProductType(id);

        return ResponseEntity.ok(removedProductTypeName);
    }
}
