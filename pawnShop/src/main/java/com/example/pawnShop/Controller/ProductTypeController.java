package com.example.pawnShop.Controller;

import com.example.pawnShop.Dto.Product.ProductTypeDto;
import com.example.pawnShop.Dto.Product.ProductTypeNameDto;
import com.example.pawnShop.Service.Contract.ProductTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/product_type")
public class ProductTypeController {
    @Autowired
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
    @PostMapping()
    public ResponseEntity<ProductTypeDto> addProductType(@RequestBody ProductTypeNameDto newProductTypeName){
        ProductTypeDto productTypeName = productTypeService.addProductType(newProductTypeName.getName());

        return ResponseEntity.ok(productTypeName);
    }
    @PatchMapping("/{id}")
    public ResponseEntity<ProductTypeDto> modifyProductType(@PathVariable UUID id, @RequestBody ProductTypeDto modifiedProductType){
        ProductTypeDto modifiedProductTypeName = productTypeService.updateProductType(id, modifiedProductType);

        return ResponseEntity.ok(modifiedProductTypeName);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ProductTypeDto> deleteProductType(@PathVariable UUID id){
        ProductTypeDto removedProductTypeName = productTypeService.deleteProductType(id);

        return ResponseEntity.ok(removedProductTypeName);
    }
}
