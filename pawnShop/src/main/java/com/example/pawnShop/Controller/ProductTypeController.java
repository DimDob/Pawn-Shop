package com.example.pawnShop.Controller;

import com.example.pawnShop.Dto.Product.ProductTypeDto;
import com.example.pawnShop.Dto.Product.ProductTypeNameDto;
import com.example.pawnShop.Dto.Result;
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
    public ResponseEntity<?> getAllProductsTypes(){

        Result<List<ProductTypeDto>> result = productTypeService.getAllProductsTypes();
        if(!result.isSuccess()){
            return ResponseEntity.ok(result.getError());
        }

        return ResponseEntity.ok(result.getValue());
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductTypeById(@PathVariable UUID id){
        Result<ProductTypeDto> result = productTypeService.getProductTypeById(id);
        if(!result.isSuccess()){
            return ResponseEntity.ok(result.getError());
        }

        return ResponseEntity.ok(result.getValue());
    }
    @PostMapping()
    public ResponseEntity<?> addProductType(@RequestBody ProductTypeNameDto newProductTypeName){

        Result<ProductTypeDto> result = productTypeService.addProductType(newProductTypeName.getName());
        if(!result.isSuccess()){
            return ResponseEntity.ok(result.getError());
        }

        return ResponseEntity.ok(result.getValue());
    }
    @PatchMapping("/{id}")
    public ResponseEntity<?> modifyProductType(@PathVariable UUID id, @RequestBody ProductTypeDto modifiedProductType){
        Result<ProductTypeDto> result = productTypeService.updateProductType(id, modifiedProductType);
        if(!result.isSuccess()){
            return ResponseEntity.ok(result.getError());
        }

        return ResponseEntity.ok(result.getValue());
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProductType(@PathVariable UUID id){
       Result<ProductTypeDto> result = productTypeService.deleteProductType(id);
       if(!result.isSuccess()){
           return ResponseEntity.ok(result.getError());
       }

        return ResponseEntity.ok(result.getValue());
    }
}
