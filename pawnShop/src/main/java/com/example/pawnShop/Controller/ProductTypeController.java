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
@RequestMapping("/product_type")
public class ProductTypeController {
    private final ProductTypeService productTypeService;

    @GetMapping()
    public ResponseEntity<List<ProductTypeDto>> getAllProductsTypes(){
        List<ProductTypeDto> productsTypes = productTypeService.getAllProductsTypes();

        return ResponseEntity.ok(productsTypes);
    }
    @GetMapping("/{id}")
    public ResponseEntity<ProductTypeDto> getProductTypeById(@PathVariable UUID id){
        ProductTypeDto productType = productTypeService.getProductTypeById(id);

        return ResponseEntity.ok(productType);
    }
    @PutMapping("/{newProductTypeName}")
    public ResponseEntity<String> addProductType(@PathVariable String newProductTypeName){
        String productTypeName = productTypeService.addProductType(newProductTypeName);

        return ResponseEntity.ok(productTypeName);
    }
    @PatchMapping("/{id}")
    public ResponseEntity<String> modifyProductType(@PathVariable UUID id, @RequestBody ProductTypeDto modifiedProductType){
        String modifiedProductTypeName = productTypeService.updateProductType(id, modifiedProductType);

        return ResponseEntity.ok(modifiedProductTypeName);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProductType(@PathVariable UUID id){
        String removedProductTypeName = productTypeService.deleteProductType(id);

        return ResponseEntity.ok(removedProductTypeName);
    }
}
